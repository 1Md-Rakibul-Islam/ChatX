# Chat API --- API Documentation

> **Version:** 1.0.0\
> **API Type:** REST + Socket.io WebSocket\
> **Environment:** Live deployment\
> **Base URL:** `https://frontend-task-chatapp.onrender.com/api`

This document formalizes the request and response behavior observed
while testing the provided Chat API through Swagger and Postman.

------------------------------------------------------------------------

## 1. Overview

The API supports:

-   Login / automatic registration
-   Current-user session restoration
-   User search by name or phone
-   1-to-1 conversations
-   Group conversations
-   Group member management
-   Group admin management
-   Group renaming
-   Message history with cursor-based pagination
-   Sending messages
-   Real-time message and conversation updates through Socket.io

------------------------------------------------------------------------

## 2. Authentication

### JWT Authentication

After a successful login, the API returns a JWT.

For protected REST endpoints, send:

``` http
Authorization: Bearer <JWT_TOKEN>
```

The same JWT is used in the Socket.io handshake.

### Public endpoint

-   `POST /auth/login`
-   `GET /health` is documented as a health endpoint, but the tested
    `/api/health` URL returned `404`.

### Protected endpoints

All other endpoints documented below require a valid bearer token unless
stated otherwise.

------------------------------------------------------------------------

# 3. Authentication APIs

## 3.1 Login or Register

### `POST /auth/login`

Logs in an existing user or automatically creates a new user when the
phone number is not registered.

### Request

**Headers**

``` http
Content-Type: application/json
```

**Body**

``` json
{
  "phone": "<PHONE_NUMBER>",
  "name": "Rakibul Islam"
}
```

### Success Response

**Status:** `200 OK`

``` json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "_id": "<USER_ID>",
    "name": "Rakibul Islam",
    "phone": "<PHONE_NUMBER>",
    "createdAt": "2026-09-07T07:06:36.576Z"
  }
}
```

### Response fields

  -----------------------------------------------------------------------
  Field                   Type                    Description
  ----------------------- ----------------------- -----------------------
  `token`                 string                  JWT used for
                                                  authenticated requests

  `user._id`              string                  User ID

  `user.name`             string                  User display name

  `user.phone`            string                  User phone number

  `user.createdAt`        string                  User creation timestamp
                                                  in ISO 8601 format
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 3.2 Get Current User

### `GET /auth/me`

Returns the user associated with the supplied bearer token. This can be
used to restore the user's session after application reload.

### Request

**Headers**

``` http
Authorization: Bearer <JWT_TOKEN>
```

### Success Response

**Status:** `200 OK`

``` json
{
  "_id": "<USER_ID>",
  "name": "Rakibul Islam",
  "phone": "<PHONE_NUMBER>",
  "createdAt": "2026-09-07T07:06:36.576Z"
}
```

### Observed Error Response

**Status:** `401 Unauthorized`

``` json
{
  "error": {
    "message": "Invalid token",
    "code": "INVALID_TOKEN"
  }
}
```

------------------------------------------------------------------------

# 4. User APIs

## 4.1 Search Users

### `GET /users/search`

Searches for other users by name or phone number.

### Query Parameters

  Parameter   Type     Required   Description
  ----------- -------- ---------- -----------------------------------------
  `q`         string   Yes        User name or phone number to search for

### Example Request

``` http
GET /users/search?q=<PHONE_NUMBER>
```

### Headers

``` http
Authorization: Bearer <JWT_TOKEN>
```

### Success Response

**Status:** `200 OK`

``` json
[
  {
    "_id": "<USER_ID>",
    "name": "Rakibul Islam",
    "phone": "<PHONE_NUMBER>"
  }
]
```

### Response fields

  Field     Type     Description
  --------- -------- -------------------
  `_id`     string   User ID
  `name`    string   User name
  `phone`   string   User phone number

------------------------------------------------------------------------

# 5. Conversation APIs

## 5.1 List My Conversations

### `GET /conversations`

Returns direct and group conversations that the authenticated user
belongs to.

### Headers

``` http
Authorization: Bearer <JWT_TOKEN>
```

### Success Response

**Status:** `200 OK`

``` json
{
  "data": [
    {
      "_id": "<CONVERSATION_ID>",
      "type": "direct",
      "lastMessage": {
        "text": "Hello! How are you?",
        "sender": "<USER_ID>",
        "createdAt": "2026-09-07T10:15:16.009Z"
      },
      "updatedAt": "2026-09-07T10:15:16.254Z",
      "participant": {
        "_id": "<USER_ID>",
        "name": "Faruk Khan",
        "phone": "<PHONE_NUMBER>"
      }
    },
    {
      "_id": "<GROUP_ID>",
      "type": "group",
      "lastMessage": {},
      "updatedAt": "2026-09-07T10:12:55.457Z",
      "name": "Updated Frontend Team",
      "createdBy": "<USER_ID>",
      "admins": [
        "<USER_ID>",
        "<USER_ID>"
      ],
      "participants": [
        {
          "_id": "<USER_ID>",
          "name": "Rakibul Islam",
          "phone": "<PHONE_NUMBER>"
        },
        {
          "_id": "<USER_ID>",
          "name": "Monir Islam",
          "phone": "<PHONE_NUMBER>"
        }
      ]
    }
  ]
}
```

### Conversation types

#### Direct conversation

``` json
{
  "_id": "<CONVERSATION_ID>",
  "type": "direct",
  "lastMessage": {},
  "updatedAt": "...",
  "participant": {
    "_id": "<USER_ID>",
    "name": "User Name",
    "phone": "<PHONE_NUMBER>"
  }
}
```

The tested response also showed that `participant` can be `null` for a
direct conversation.

#### Group conversation

Group conversations include:

-   `_id`
-   `type`
-   `name`
-   `createdBy`
-   `admins`
-   `participants`
-   `lastMessage`
-   `updatedAt`

------------------------------------------------------------------------

## 5.2 Start Direct Conversation

### `POST /conversations`

Starts or opens a 1-to-1 conversation with another user.

### Headers

``` http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

``` json
{
  "userId": "<OTHER_USER_ID>"
}
```

### Success Response

**Status:** `200 OK`

``` json
{
  "_id": "<CONVERSATION_ID>",
  "participants": [
    "<USER_ID>",
    "<USER_ID>"
  ],
  "createdAt": "2026-09-07T07:13:15.878Z"
}
```

### Implementation note

The test request used the current user's ID as `userId`, and the
observed response contained the same user ID twice in `participants`.
This appears to be an API edge case. The frontend should normally search
for and select another user before starting a direct conversation.

------------------------------------------------------------------------

## 5.3 Get Conversation Messages

### `GET /conversations/{id}/messages`

Returns message history for a conversation.

### Path Parameters

  Parameter   Type     Required   Description
  ----------- -------- ---------- -----------------
  `id`        string   Yes        Conversation ID

### Query Parameters

  -----------------------------------------------------------------------
  Parameter         Type              Required          Description
  ----------------- ----------------- ----------------- -----------------
  `limit`           integer           No                Maximum number of
                                                        messages returned
                                                        per page

  `before`          string            No                Cursor for
                                                        fetching messages
                                                        older than the
                                                        supplied
                                                        message/cursor
  -----------------------------------------------------------------------

### Example Request

``` http
GET /conversations/<CONVERSATION_ID>/messages?limit=10
```

### Headers

``` http
Authorization: Bearer <JWT_TOKEN>
```

### Success Response

**Status:** `200 OK`

``` json
{
  "messages": [
    {
      "_id": "<MESSAGE_ID>",
      "conversation": "<CONVERSATION_ID>",
      "sender": "<USER_ID>",
      "text": "Hello! How are you?",
      "createdAt": "2026-09-07T10:15:16.009Z"
    }
  ],
  "hasMore": false
}
```

### Pagination

When `hasMore` is `true`, the client can request older messages using
the `before` cursor.

Example:

``` http
GET /conversations/<CONVERSATION_ID>/messages?limit=10&before=<CURSOR>
```

------------------------------------------------------------------------

# 6. Group APIs

## 6.1 Create Group

### `POST /conversations/group`

Creates a group conversation. The creator becomes an admin.

### Headers

``` http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

``` json
{
  "name": "Project Team",
  "participantIds": [
    "<USER_ID_1>",
    "<USER_ID_2>",
    "<USER_ID_3>"
  ]
}
```

### Success Response

**Status:** `201 Created`

``` json
{
  "_id": "<GROUP_ID>",
  "type": "group",
  "name": "Project Team",
  "createdBy": "<USER_ID>",
  "admins": [
    "<USER_ID>"
  ],
  "participants": [
    {
      "_id": "<USER_ID>",
      "name": "Rakibul Islam",
      "phone": "<PHONE_NUMBER>"
    },
    {
      "_id": "<USER_ID>",
      "name": "Sipon Islam",
      "phone": "<PHONE_NUMBER>"
    },
    {
      "_id": "<USER_ID>",
      "name": "Monir Islam",
      "phone": "<PHONE_NUMBER>"
    }
  ],
  "createdAt": "2026-09-07T10:28:52.777Z",
  "updatedAt": "2026-09-07T10:28:52.777Z"
}
```

------------------------------------------------------------------------

## 6.2 Add Group Members

### `POST /conversations/{id}/participants`

Adds one or more members to a group.

**Permission:** Admin only.

### Path Parameters

  Parameter   Type     Required   Description
  ----------- -------- ---------- -------------
  `id`        string   Yes        Group ID

### Request Body

``` json
{
  "userIds": [
    "<USER_ID>"
  ]
}
```

### Success Response

**Status:** `200 OK`

``` json
{
  "_id": "<GROUP_ID>",
  "type": "group",
  "name": "Project Team",
  "createdBy": "<USER_ID>",
  "admins": [
    "<USER_ID>"
  ],
  "participants": [
    {
      "_id": "<USER_ID>",
      "name": "Rakibul Islam",
      "phone": "<PHONE_NUMBER>"
    },
    {
      "_id": "<USER_ID>",
      "name": "Sipon Islam",
      "phone": "<PHONE_NUMBER>"
    },
    {
      "_id": "<USER_ID>",
      "name": "Monir Islam",
      "phone": "<PHONE_NUMBER>"
    }
  ],
  "createdAt": "2026-09-07T10:28:52.777Z",
  "updatedAt": "2026-09-07T10:30:12.071Z"
}
```

------------------------------------------------------------------------

## 6.3 Remove Member / Leave Group

### `DELETE /conversations/{id}/participants/{userId}`

Removes a member from a group. Passing the current user's own ID allows
the user to leave the group.

**Permission:** Admins can remove members; any member can leave.

### Path Parameters

  -----------------------------------------------------------------------
  Parameter         Type              Required          Description
  ----------------- ----------------- ----------------- -----------------
  `id`              string            Yes               Group ID

  `userId`          string            Yes               Member ID to
                                                        remove, or
                                                        current user's ID
                                                        to leave
  -----------------------------------------------------------------------

### Success Response

**Status:** `200 OK`

``` json
{
  "_id": "<GROUP_ID>",
  "type": "group",
  "name": "Project Team",
  "createdBy": "<USER_ID>",
  "admins": [
    "<USER_ID>"
  ],
  "participants": [
    {
      "_id": "<USER_ID>",
      "name": "Rakibul Islam",
      "phone": "<PHONE_NUMBER>"
    },
    {
      "_id": "<USER_ID>",
      "name": "Monir Islam",
      "phone": "<PHONE_NUMBER>"
    }
  ],
  "createdAt": "2026-09-07T10:28:52.777Z",
  "updatedAt": "2026-09-07T10:31:40.960Z"
}
```

------------------------------------------------------------------------

## 6.4 Promote Member to Admin

### `POST /conversations/{id}/admins`

Promotes an existing group member to admin.

**Permission:** Admin only.

### Path Parameters

  Parameter   Type     Required   Description
  ----------- -------- ---------- -------------
  `id`        string   Yes        Group ID

### Request Body

``` json
{
  "userId": "<MEMBER_ID>"
}
```

### Success Response

**Status:** `200 OK`

``` json
{
  "_id": "<GROUP_ID>",
  "type": "group",
  "name": "Project Team",
  "createdBy": "<USER_ID>",
  "admins": [
    "<USER_ID>",
    "<USER_ID>"
  ],
  "participants": [
    {
      "_id": "<USER_ID>",
      "name": "Rakibul Islam",
      "phone": "<PHONE_NUMBER>"
    },
    {
      "_id": "<USER_ID>",
      "name": "Monir Islam",
      "phone": "<PHONE_NUMBER>"
    }
  ],
  "createdAt": "2026-09-07T10:28:52.777Z",
  "updatedAt": "2026-09-07T10:33:06.544Z"
}
```

------------------------------------------------------------------------

## 6.5 Rename Group

### `PATCH /conversations/{id}`

Renames a group.

**Permission:** Admin only.

### Path Parameters

  Parameter   Type     Required   Description
  ----------- -------- ---------- -------------
  `id`        string   Yes        Group ID

### Request Body

``` json
{
  "name": "Renamed Team 01"
}
```

### Success Response

**Status:** `200 OK`

``` json
{
  "_id": "<GROUP_ID>",
  "type": "group",
  "name": "Renamed Team 01",
  "createdBy": "<USER_ID>",
  "admins": [
    "<USER_ID>",
    "<USER_ID>"
  ],
  "participants": [
    {
      "_id": "<USER_ID>",
      "name": "Rakibul Islam",
      "phone": "<PHONE_NUMBER>"
    },
    {
      "_id": "<USER_ID>",
      "name": "Monir Islam",
      "phone": "<PHONE_NUMBER>"
    }
  ],
  "createdAt": "2026-09-07T10:28:52.777Z",
  "updatedAt": "2026-09-07T10:34:03.067Z"
}
```

------------------------------------------------------------------------

# 7. Message APIs

## 7.1 Send Message

### `POST /messages`

Sends a message to either a direct or group conversation.

Messages are also delivered through the Socket.io `message:new` event.

### Headers

``` http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

``` json
{
  "conversationId": "<CONVERSATION_ID>",
  "text": "Hello! How are you?"
}
```

### Success Response

**Status:** `200 OK`

``` json
{
  "_id": "<MESSAGE_ID>",
  "conversation": "<CONVERSATION_ID>",
  "sender": "<USER_ID>",
  "text": "Hello! How are you?",
  "createdAt": "2026-09-07T10:36:16.938Z"
}
```

### Frontend validation

The assignment requires empty messages to be rejected by the UI.
Therefore, the frontend should prevent submission when the message is
empty or contains only whitespace.

------------------------------------------------------------------------

# 8. Real-Time WebSocket API

The real-time layer uses **Socket.io**.

> The WebSocket connects to the server's root origin, **not** the `/api`
> REST base URL.

## 8.1 Connection

``` javascript
const socket = io(
  "https://frontend-task-chatapp.onrender.com",
  {
    auth: {
      token
    }
  }
);
```

The JWT is passed through Socket.io handshake authentication.

An invalid or missing token is rejected by the server.

------------------------------------------------------------------------

## 8.2 Client → Server: `message:send`

Sends a message through the socket.

### Payload

``` json
{
  "conversationId": "<CONVERSATION_ID>",
  "text": "Hello!"
}
```

An optional acknowledgement callback may be supplied.

------------------------------------------------------------------------

## 8.3 Server → Client: `message:new`

Emitted when a new message arrives for the user.

### Purpose

The frontend listens to this event and updates the currently relevant
conversation/message list without requiring a page refresh.

------------------------------------------------------------------------

## 8.4 Server → Client: `conversation:updated`

Emitted when a group conversation changes, including:

-   Group creation
-   Group rename
-   Member changes
-   Admin changes

The frontend should update the conversation list/group details when this
event is received.

------------------------------------------------------------------------

# 9. Health Check

## `GET /health`

The Swagger specification documents a health-check endpoint.

### Tested URL

``` http
GET https://frontend-task-chatapp.onrender.com/api/health
```

### Observed Response

**Status:** `404 Not Found`

``` json
{
  "error": {
    "message": "Route not found",
    "code": "NOT_FOUND"
  }
}
```

### Issue

The documented REST base URL is `/api`, but the tested `/api/health`
endpoint returned `404`. This endpoint should therefore not be relied
upon by the frontend unless the actual working health-check URL is
confirmed separately.

------------------------------------------------------------------------

# 10. Common Data Structures

## User

``` json
{
  "_id": "<USER_ID>",
  "name": "User Name",
  "phone": "<PHONE_NUMBER>",
  "createdAt": "2026-09-07T07:06:36.576Z"
}
```

## Participant

``` json
{
  "_id": "<USER_ID>",
  "name": "User Name",
  "phone": "<PHONE_NUMBER>"
}
```

## Message

``` json
{
  "_id": "<MESSAGE_ID>",
  "conversation": "<CONVERSATION_ID>",
  "sender": "<USER_ID>",
  "text": "Hello!",
  "createdAt": "2026-09-07T10:36:16.938Z"
}
```

## Group Conversation

``` json
{
  "_id": "<GROUP_ID>",
  "type": "group",
  "name": "Project Team",
  "createdBy": "<USER_ID>",
  "admins": [
    "<USER_ID>"
  ],
  "participants": [],
  "createdAt": "2026-09-07T10:28:52.777Z",
  "updatedAt": "2026-09-07T10:28:52.777Z"
}
```

------------------------------------------------------------------------

# 11. Endpoint Summary

  ---------------------------------------------------------------------------------------------------
  Method            Endpoint                                      Authentication    Purpose
  ----------------- --------------------------------------------- ----------------- -----------------
  POST              `/auth/login`                                 No                Login / automatic
                                                                                    registration

  GET               `/auth/me`                                    Yes               Get current user

  GET               `/users/search`                               Yes               Search users

  GET               `/conversations`                              Yes               List
                                                                                    conversations

  POST              `/conversations`                              Yes               Start/open direct
                                                                                    conversation

  GET               `/conversations/{id}/messages`                Yes               Get message
                                                                                    history

  POST              `/conversations/group`                        Yes               Create group

  POST              `/conversations/{id}/participants`            Yes               Add group members

  DELETE            `/conversations/{id}/participants/{userId}`   Yes               Remove member /
                                                                                    leave group

  POST              `/conversations/{id}/admins`                  Yes               Promote member to
                                                                                    admin

  PATCH             `/conversations/{id}`                         Yes               Rename group

  POST              `/messages`                                   Yes               Send message

  GET               `/health`                                     No                Health check;
                                                                                    tested
                                                                                    `/api/health`
                                                                                    returned 404
  ---------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 12. Frontend Integration Flow

The recommended application flow based on the tested API is:

``` text
Login
  ↓
Store JWT + User
  ↓
GET /auth/me on app startup
  ↓
GET /conversations
  ↓
Search users when starting a conversation
  ↓
POST /conversations
  ↓
GET /conversations/{id}/messages
  ↓
POST /messages
  ↓
Listen for message:new
  ↓
Update UI in real time
```

For group conversations:

``` text
Create Group
  ↓
POST /conversations/group
  ↓
Add / remove members
  ↓
Promote admins
  ↓
Rename group
  ↓
Listen for conversation:updated
```

------------------------------------------------------------------------

# 13. Observed API Notes / Issues

The following behaviors were observed during testing:

1.  `POST /auth/login` returned `200` with a JWT and user object.
2.  `GET /auth/me` returned `200` with the authenticated user.
3.  `GET /users/search` returned a user array.
4.  `GET /conversations` returned `{ "data": [...] }` containing both
    direct and group conversations.
5.  A direct conversation response can contain a `participant` object or
    `null`.
6.  The direct-conversation test using the current user's own ID
    returned the same user ID twice in `participants`; this was treated
    as an edge case rather than a normal application flow.
7.  `GET /conversations/{id}/messages` returned a `messages` array and
    `hasMore` pagination flag.
8.  Group creation returned `201 Created`.
9.  Group member/admin/rename operations returned the updated group
    object.
10. `POST /messages` returned the created message object.
11. The documented `/api/health` endpoint returned `404 Not Found`
    during testing.

Only status codes and error bodies actually observed during testing are
documented here; unobserved error cases are not fabricated.

------------------------------------------------------------------------

# 14. Related Resources

-   Swagger UI: `https://frontend-task-chatapp.onrender.com/docs/`
-   REST Base URL: `https://frontend-task-chatapp.onrender.com/api`
-   Socket.io Origin: `https://frontend-task-chatapp.onrender.com`

------------------------------------------------------------------------

## Documentation Note

This API documentation was created from the provided Swagger
specification and observed live test responses. It is intended to serve
as the API reference for the frontend take-home implementation.
Madagascar.
