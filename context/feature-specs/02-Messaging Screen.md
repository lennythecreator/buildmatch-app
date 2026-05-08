This screen is responsible for where the user views their messages. It's responsible for letting the user message other users and where all communications will be handled. This leverages web sockets for realtime updates.

## User Card
Create `components/messaging/user-card.tsx`

Requirements:
- It should display the user's name with medium font thickness. 
- Should have a circular avatar on the left with the user's image 
- Should display the last message sent and the time of that message 
- Should have a read and unread mode to let the user know if they have read the message or not.
- should be borderless.

## Search Bar 
Create `components/messaging/search-bar.tsx`

Requirements:
- should be borderless with a foreground color 
- place holder text should be search conversations

## Chat Layout
Create `components/messaging/chat.tsx`

Requirements:
- should have a header showing the contact the user is messagaing 
- should have a back button to go back the list of conversations
- Should be a container for the conversation between the user and who they are messaging the users message should be on the right and the contacts message on the left 
- should be scrollable.

## Message
Create `components/messaging/message.tsx`

Requirements:
- should a speech bubble with the time sent and the status of the message(sent/delivered)
- should have 2 different versions for the sender and the receiver and oreination should reflect that left for reciever and right for sender 

## Composer
Create `components/messaging/composer.tsx`

Requirements:
- should be a responsive input where a user can type in their message
- should have a plus icon on the left where user can upload attachments(media)
- should have a  mini preview card for non-photo media e.g pdfs, word docs that appears at the top when user uploads attachment
- should have a send button on the right that looks like a paper plane 

## Coversation List 
Create `components/messaging/conversations.tsx`

Requirements:
- Display a vertical list view of user cards and a search bar at the top
- when user taps on the user card they should be navigated to a dynamic route here the chat layout and conversation context lives 

## Conversation 
Create `app/conversation/[id].tsx`

Requirements:
- a dynamic view that shows the converation.