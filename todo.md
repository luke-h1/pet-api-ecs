## TODO currently:

---

Add support for FIFO recent searches via local storage
add breed query param
Simplify data model for breeds - cat, dogs, reptiles, fish etc.
Add support for filtering by breed
Add auth context

---

future plans

- messages table:
  - senderId
  - receiverId
  - petId
  - message

* add ability for users to send messages to each other. Will do this via pub sub and store messages in db. see https://dev.to/franciscomendes10866/using-redis-pub-sub-with-node-js-13k3 for example
