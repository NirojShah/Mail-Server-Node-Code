const Imap = require('node-imap');

const imap = new Imap({
    user: 'accounts@localserver.com',
    password: 'test1234',
    host: 'localhost', // IMAP server hostname
    port: 993, // IMAP server port (usually 993 for SSL)
    tls: true, // Use TLS/SSL
});
imap.connect();
imap.once('ready', () => {
    imap.openBox('INBOX', true, (err, box) => {
        if (err) throw err;
        console.log(`Connected to mailbox: ${box.name}`);

        // Now you can fetch emails, search for messages, etc.
    });
});
const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], markSeen: false };
const fetch = imap.seq.fetch('1:10', fetchOptions);

fetch.on('message', (msg, seqno) => {
    msg.on('body', (stream) => {
        let buffer = '';
        stream.on('data', (chunk) => (buffer += chunk.toString()));
        stream.on('end', () => {
            console.log(`Message #${seqno}: ${buffer}`);
        });
    });
});

fetch.once('end', () => {
    console.log('All messages fetched.');
    imap.end(); // Close the connection
});
imap.once('error', (err) => {
    console.error('IMAP error:', err);
});

imap.once('end', () => {
    console.log('Disconnected from IMAP server.');
});
