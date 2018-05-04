self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  if (requestURL.origin != location.origin) return;
  
  if (requestURL.pathname.endsWith("/demos/simple-stream/")) {
    event.respondWith(umpaLumpaStream());
  }
});

function retab(str) {
  // remove blank lines
  str = str.replace(/^\s*\n|\n\s*$/g, '');
  const firstIndent = /^\s*/.exec(str)[0];
  return str.replace(RegExp('^' + firstIndent, 'mg'), '');
}

function umpaLumpaStream() {
  const html = retab(`
    <!DOCTYPE html>
    <style>
      html {
        font-family: sans-serif;
      }
    </style>

    <h1>The Oompa Loompa song</h1>
    
    <p>
      Oompa loompa doompety doo<br>
      I've got a perfect puzzle for you<br>
      Oompa loompa doompety dee<br>
      If you are wise you'll listen to me
    </p>

    <p>
      What do you get when you guzzle down sweets<br>
      Eating as much as an elephant eats<br>
      What are you at, getting terribly fat<br>
      What do you think will come of that<br>
      I don't like the look of it
    </p>

    <p>
      Oompa loompa doompety da<br>
      If you're not greedy, you will go far<br>
      You will live in happiness too<br>
      Like the Oompa Loompa Doompety do<br>
      Doompety do
    </p>

    <p>
      Oompa loompa doompety doo<br>
      I've got another puzzle for you<br>
      Oompa loompa doompeda dee<br>
      If you are wise you'll listen to me
    </p>

    <p>
      Gum chewing's fine when it's once in a while<br>
      It stops you from smoking and brightens your smile<br>
      But it's repulsive, revolting and wrong<br>
      Chewing and chewing all day long<br>
      The way that a cow does
    </p>

    <p>
      Oompa loompa doompety da<br>
      Given good manners you will go far<br>
      You will live in happiness too<br>
      Like the Oompa Loompa Doompety do<br>
    </p>

    <p>
      Oompa loompa doompety doo<br>
      I've got another puzzle for you<br>
      Oompa loompa doompety dee<br>
      If you are wise you'll listen to me
    </p>

    <p>
      Who do you blame when your kid is a brat<br>
      Pampered and spoiled like a siamese cat<br>
      Blaming the kids is a lie and a shame<br>
      You know exactly who's to blame<br>
      The mother and the father
    </p>

    <p>
      Oompa loompa doompety da<br>
      If you're not spoiled then you will go far<br>
      You will live in happiness too<br>
      Like the Oompa Loompa Doompety do
    </p>

    <p>
      Oompa loompa doompety doo<br>
      I've got another puzzle for you<br>
      Oompa loompa doompeda dee<br>
      If you are wise you'll listen to me
    </p>

    <p>
      What do you get from a glut of TV<br>
      A pain in the neck and an IQ of three<br>
      Why don't you try simply reading a book<br>
      Or could you just not bear to look<br>
      You'll get no<br>
      You'll get no<br>
      You'll get no<br>
      You'll get no<br>
      You'll get no commercials
    </p>

    <p>
      Oompa loompa doompety da<br>
      If you're not greedy you will go far<br>
      You will live in happiness too<br>
      Like the - Oompa -<br>
      Oompa Loompa Doompety do
    </p>
  `);

  const stream = new ReadableStream({
    start: controller => {
      const encoder = new TextEncoder();
      let pos = 0;
      let chunkSize = 1;

      function push() {
        if (pos >= html.length) {
          controller.close();
          return;
        }
        
        controller.enqueue(
          encoder.encode(html.slice(pos, pos + chunkSize))
        );

        pos += chunkSize;
        setTimeout(push, 5);
      }

      push();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html'
    }
  });
}