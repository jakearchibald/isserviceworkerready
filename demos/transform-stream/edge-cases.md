# Searching a stream

When searching for something in a stream there's a little gotcha when it comes to chunk boundaries. Say we were searching for "service workers", because things arrive in chunks, one chunk could be "this next section is about se" and the next one "rvice workers". Neither chunk contains "service workers", so a naive check of each chunk isn't good enough.

To work around this, a buffer is kept. The buffer needs to be at least the length of the search term - 1 to avoid missing matches across boundaries.

# Search & replace in a stream

In addition to above, there's another gotcha:

Say we were replacing "lol" with "goal" in "lolol". We maintain a buffer of two chars because that's `"lol".length - 1`, meaning we don't miss matches between boundaries. It could go like this:

1. Buffer is `""`
2. Chunk arrives `"lolol"`, add to buffer
3. Buffer is `"lolol"`
4. Replace "lol" with "goal" in buffer
5. Buffer is `"goalol"`
6. Send buffer up to position `"lol".length - 1` - `"goal"`
7. Set buffer to the remainder of the previous step - `"ol"`
8. Incoming stream ends
9. Send remaining buffer `"ol"`

This sends `"goalol"`, which is correct. But what if:

1. Buffer is `""`
2. Chunk arrives `"lol"`, add to buffer
3. Buffer is `"lol"`
4. Replace "lol" with "goal" in buffer
5. Buffer is `"goal"`
6. Send buffer up to position `"lol".length - 1` - `"go"`
7. Set buffer to the remainder of the previous step - `"al"`
8. Chunk arrives `"ol"`, add to buffer
9. Buffer is `"alol"`
10. Replace "lol" with "goal" in buffer
11. Buffer is `"agoal"`
12. Send buffer up to position `"lol".length - 1` - `"ago"`
13. Set buffer to the remainder of the previous step - `"al"`
14. Incoming stream ends
15. Send remaining buffer `"al"`

This sends `"goagoal"`, which is wrong. To fix this, the buffer should be flushed until the position of the last replacement, or up to position `buffer.length - ("lol".length - 1)`, whichever's greater. So:

1. Buffer is `""`
2. Chunk arrives `"lol"`, add to buffer
3. Buffer is `"lol"`
4. Replace "lol" with "goal" in buffer
5. Buffer is `"goal"`
6. Send buffer until the end of the last replacement, or `buffer.length - ("lol" - 1)`, whichever's greater - `"goal"`
7. Set buffer to the remainder of the previous step - `""`
8. Chunk arrives `"ol"`, add to buffer
9. Buffer is `"ol"`
10. Replace "lol" with "goal" in buffer
11. Buffer is `"ol"`
12. Send buffer until the end of the last replacement, or `buffer.length - ("lol" - 1)`, whichever's greater - `""`
13. Set buffer to the last `"lol".length - 1` chars of buffer - `"ol"`
14. Incoming stream ends
15. Send remaining buffer `"ol"`

Phew! Because of this, doing a regex replacement in a stream is tricky, as regex can match varying lengths, eg `/clo+ud/`, making choosing a buffer size tricky.
