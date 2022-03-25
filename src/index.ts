import { app } from './server';
import { Database } from './database';
import { Server } from 'http';

const port = process.env.PORT || 3000;
let server: Server | null = null;
const database = Database.getInstance();

// handle graceful shutdown
const gracefulShutdown = async (event: string, err: Error) => {
    console.log(`${event} signal received: closing HTTP server, cause: ${err}`);
    if (server) {
        server.close((closeErr) => console.error(closeErr));
    }
    await database.Close();
    process.exit();
};
['SIGINT', 'SIGTERM', 'exit', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'].forEach((event) => {
    process.on(event, async (err) => {
        await gracefulShutdown(event, err);
    });
});

// connect to database
database
    .Connect()
    .then(() => {
        // finally start
        server = app.listen(port, () => console.log(`Server is listening on port ${port}!`));
    })
    .catch((err: Error) => console.error(err));
