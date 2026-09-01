<?php

namespace App\Console\Commands;

use App\Support\AmqpEventPublisher;
use App\Support\OutboxMessage;
use Illuminate\Console\Command;
use Throwable;

class OutboxPublishCommand extends Command
{
    protected $signature = 'outbox:publish
        {--watch : Terus berjalan dan menerbitkan event baru secara berkala}
        {--sleep= : Jeda antar iterasi pada mode watch (detik)}
        {--batch=100 : Jumlah event maksimum per iterasi}';

    protected $description = 'Menerbitkan event domain dari tabel outbox ke RabbitMQ';

    public function handle(): int
    {
        $publisher = new AmqpEventPublisher;

        do {
            $published = $this->publishPending($publisher);

            if (! $this->option('watch')) {
                $publisher->close();
                $this->info("{$published} event diterbitkan.");

                return self::SUCCESS;
            }

            sleep((int) ($this->option('sleep') ?? config('messaging.watch_sleep_seconds')));
        } while (true);
    }

    private function publishPending(AmqpEventPublisher $publisher): int
    {
        $messages = OutboxMessage::query()
            ->whereNull('published_at')
            ->orderBy('created_at')
            ->orderBy('id')
            ->limit((int) $this->option('batch'))
            ->get();

        $published = 0;

        foreach ($messages as $message) {
            try {
                $publisher->publish($message);
                $message->forceFill(['published_at' => now(), 'attempts' => $message->attempts + 1])->save();
                $published++;
            } catch (Throwable $exception) {
                $message->forceFill(['attempts' => $message->attempts + 1, 'last_error_at' => now()])->save();
                report($exception);
                $publisher->close();

                break;
            }
        }

        return $published;
    }
}
