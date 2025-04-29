
export interface ChatParticipant {
  id: string;
  name: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  content: string;
  timestamp: string;
  image?: string;
}

export interface ChatThread {
  id: string;
  participants: ChatParticipant[];
  lastActive: string;
  messages: ChatMessage[];
  status?: string;
}

export const chatThreads: ChatThread[] = [
  {
    id: 'ai-chat',
    participants: [
      { id: '1', name: 'You', image: 'https://i.pravatar.cc/150?img=1' },
      { id: 'ai', name: 'AI Chat', image: '/public/lovable-uploads/81a77925-6cb5-4a07-a00a-f1d322ecab45.png' }
    ],
    lastActive: '2023-04-18T09:30:00Z',
    messages: [
      {
        id: '1',
        senderId: 'ai',
        senderName: 'AI Chat',
        senderImage: '/public/lovable-uploads/81a77925-6cb5-4a07-a00a-f1d322ecab45.png',
        content: "Hello! How can I assist you today?",
        timestamp: '2023-04-18T09:30:00Z',
      },
      {
        id: '2',
        senderId: '1',
        senderName: 'You',
        senderImage: 'https://i.pravatar.cc/150?img=1',
        content: "I've been feeling anxious lately, any tips?",
        timestamp: '2023-04-18T09:31:00Z',
      },
      {
        id: '3',
        senderId: 'ai',
        senderName: 'AI Chat',
        senderImage: '/public/lovable-uploads/81a77925-6cb5-4a07-a00a-f1d322ecab45.png',
        content: "I'm sorry to hear you've been feeling anxious. Some helpful techniques include deep breathing exercises, mindfulness meditation, and regular physical activity. Would you like me to explain any of these in more detail?",
        timestamp: '2023-04-18T09:32:00Z',
      },
    ]
  },
  {
    id: 'kelvin-chat',
    participants: [
      { id: '1', name: 'You', image: 'https://i.pravatar.cc/150?img=1' },
      { id: '5', name: 'Kelvin Juma', image: 'https://i.pravatar.cc/150?img=6' }
    ],
    lastActive: '2023-04-17T14:20:00Z',
    status: 'Active 1h ago',
    messages: [
      {
        id: '1',
        senderId: '5',
        senderName: 'Kelvin Juma',
        senderImage: 'https://i.pravatar.cc/150?img=6',
        content: "Hey, how are you doing today?",
        timestamp: '2023-04-17T14:00:00Z',
      },
      {
        id: '2',
        senderId: '1',
        senderName: 'You',
        senderImage: 'https://i.pravatar.cc/150?img=1',
        content: "I'm not feeling great, to be honest.",
        timestamp: '2023-04-17T14:05:00Z',
      },
      {
        id: '3',
        senderId: '5',
        senderName: 'Kelvin Juma',
        senderImage: 'https://i.pravatar.cc/150?img=6',
        content: "I'm sorry to hear that. Would you like to talk about it?",
        timestamp: '2023-04-17T14:10:00Z',
      },
      {
        id: '4',
        senderId: '1',
        senderName: 'You',
        senderImage: 'https://i.pravatar.cc/150?img=1',
        content: "Maybe later. Thanks for checking in though.",
        timestamp: '2023-04-17T14:20:00Z',
      },
    ]
  },
  {
    id: 'ann-chat',
    participants: [
      { id: '1', name: 'You', image: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Ann Silo', image: 'https://i.pravatar.cc/150?img=5' }
    ],
    lastActive: '2023-04-18T11:45:00Z',
    status: 'Online',
    messages: [
      {
        id: '1',
        senderId: '2',
        senderName: 'Ann Silo',
        senderImage: 'https://i.pravatar.cc/150?img=5',
        content: "Hello how was your day",
        timestamp: '2023-04-18T11:30:00Z',
      },
      {
        id: '2',
        senderId: '1',
        senderName: 'You',
        senderImage: 'https://i.pravatar.cc/150?img=1',
        content: "Good....All I needed was a trip",
        timestamp: '2023-04-18T11:35:00Z',
      },
      {
        id: '3',
        senderId: '2',
        senderName: 'Ann Silo',
        senderImage: 'https://i.pravatar.cc/150?img=5',
        content: "Animals have a therapeutic effect :)",
        timestamp: '2023-04-18T11:40:00Z',
        image: '/public/lovable-uploads/5be5c26e-9b58-46d9-9cc8-075014294b4b.png'
      },
      {
        id: '4',
        senderId: '1',
        senderName: 'You',
        senderImage: 'https://i.pravatar.cc/150?img=1',
        content: "Glad you took my advice",
        timestamp: '2023-04-18T11:45:00Z',
      },
    ]
  },
  {
    id: 'oscar-chat',
    participants: [
      { id: '1', name: 'You', image: 'https://i.pravatar.cc/150?img=1' },
      { id: '6', name: 'Oscar Ben', image: 'https://i.pravatar.cc/150?img=8' }
    ],
    lastActive: '2023-04-17T09:15:00Z',
    status: '45m',
    messages: [
      {
        id: '1',
        senderId: '6',
        senderName: 'Oscar Ben',
        senderImage: 'https://i.pravatar.cc/150?img=8',
        content: "I finished reading the book you recommended!",
        timestamp: '2023-04-17T09:00:00Z',
      },
      {
        id: '2',
        senderId: '1',
        senderName: 'You',
        senderImage: 'https://i.pravatar.cc/150?img=1',
        content: "What did you think of it?",
        timestamp: '2023-04-17T09:05:00Z',
      },
      {
        id: '3',
        senderId: '6',
        senderName: 'Oscar Ben',
        senderImage: 'https://i.pravatar.cc/150?img=8',
        content: "It was really insightful. I'm going to try some of the techniques mentioned.",
        timestamp: '2023-04-17T09:15:00Z',
      },
    ]
  },
  {
    id: 'marc-chat',
    participants: [
      { id: '1', name: 'You', image: 'https://i.pravatar.cc/150?img=1' },
      { id: '7', name: 'Marc Williams', image: 'https://i.pravatar.cc/150?img=10' }
    ],
    lastActive: '2023-04-16T16:30:00Z',
    status: '4y',
    messages: [
      {
        id: '1',
        senderId: '7',
        senderName: 'Marc Williams',
        senderImage: 'https://i.pravatar.cc/150?img=10',
        content: "Hi there! Just checking in to see how you've been.",
        timestamp: '2023-04-16T16:20:00Z',
      },
      {
        id: '2',
        senderId: '1',
        senderName: 'You',
        senderImage: 'https://i.pravatar.cc/150?img=1',
        content: "I've been doing really well lately. Thanks for asking!",
        timestamp: '2023-04-16T16:25:00Z',
      },
      {
        id: '3',
        senderId: '7',
        senderName: 'Marc Williams',
        senderImage: 'https://i.pravatar.cc/150?img=10',
        content: "That's great to hear. Let me know if you ever need to talk.",
        timestamp: '2023-04-16T16:30:00Z',
      },
    ]
  }
];
