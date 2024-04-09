const http = require('http');
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');

      // Example user configurations
      const userConfigs = [
        {
          user: 'accounts@localserver.com',
          password: 'test1234',
          host: 'localserver.com',
          port: 143,
          tls: false,
        },{
            user: 'nirajshah@localserver.com',
            password: 'test1234',
            host: 'localserver.com',
            port: 143,
            tls: false,
          },
        // Add more user configurations as needed
      ]
      // Create an HTTP server
      const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Listening for new emails...\n');
      });
      
      server.listen(3000, '127.0.0.1', () => {
        console.log('Server running at http://127.0.0.1:3000/');
      });
      
      // Function to fetch emails for a given user
      function fetchEmailsForUser(userConfig) {
        const imap = new Imap(userConfig);
      
        imap.connect();
      
        imap.once('ready', () => {
          imap.openBox('INBOX', true, (err, box) => {
            if (err) {
              console.error(err);
              return;
            }
      
            // Listen for new emails
            imap.on('mail', (numNewMsgs) => {
              console.log(`New email received for user ${userConfig.user}. Total new messages: ${numNewMsgs}`);
              imap.search(['ALL'], (err, results) => {
                if (err) {
                  console.error(err);
                  return;
                }
      
                const fetch = imap.fetch(results, { bodies: '' });
      
                fetch.on('message', (msg) => {
                  msg.on('body', (stream, info) => {
                    simpleParser(stream, async (err, parsed) => {
                      if (err) {
                        console.error(err);
                        return;
                      }
      
                      console.log('From:', parsed.headers.get('from').text);
                      console.log('Subject:', parsed.subject);
                      console.log('Text body:', parsed.text);
                      console.log('HTML body:', parsed.html);
                      console.log("Attachment:",parsed.attachments)
                    });
                  });
                });
      
                fetch.once('error', (err) => {
                  console.error(err);
                });
      
                fetch.once('end', () => {
                  // Close the connection after fetching the email
                  imap.end();
                });
              });
            });
          });
        });
      
        imap.once('error', (err) => {
          console.error(err);
        });
      
        imap.once('end', () => {
          console.log(`Connection ended for user ${userConfig.user}`);
        });
      }
      
      // Fetch emails for each user
      userConfigs.forEach((userConfig) => {
        fetchEmailsForUser(userConfig);
      });
      