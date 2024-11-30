
export const categories = ['Payment', 'Account', 'Poll', 'List', 'Data', 'Chat', 'Group', 'AT', 'System', 'Other']

export const actions = {
  GET_USER_ACCOUNT: {
    category: "Account",
    isTx: false,
    requiresApproval: true,
    isGatewayDisabled: false,
    explanation: ""
  },
  DECRYPT_DATA: {
    category: "Data",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
    explaination: ""
  },
  SEND_COIN: {
    category: "Payment",
    isTx: true,
    requiresApproval: true,
    isGatewayDisabled: null,
    isGatewayDisabledExplanation: "Only QORT is permitted through gateways"
  },
  GET_LIST_ITEMS: {
    category: "List",
    isTx: false,
    requiresApproval: true,
    isGatewayDisabled: true,
  },
  ADD_LIST_ITEMS: {
    category: "List",
    isTx: false,
    requiresApproval: true,
    isGatewayDisabled: true,
  },
  DELETE_LIST_ITEM: {
    category: "List",
    isTx: false,
    requiresApproval: true,
    isGatewayDisabled: true,
  },
  VOTE_ON_POLL: {
    category: "Poll",
    isTx: true,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  CREATE_POLL: {
    category: "Poll",
    isTx: true,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  SEND_CHAT_MESSAGE: {
    category: "Chat",
    isTx: true,
    txType: 'Unconfirmed',
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  JOIN_GROUP: {
    category: "Group",
    isTx: true,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  DEPLOY_AT: {
    category: "AT",
    isTx: true,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  GET_USER_WALLET: {
    category: "Account",
    isTx: false,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  GET_WALLET_BALANCE: {
    category: "Account",
    isTx: false,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  GET_USER_WALLET_INFO: {
    category: "Account",
    isTx: false,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  GET_CROSSCHAIN_SERVER_INFO: {
    category: "Payment",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
  },
  GET_TX_ACTIVITY_SUMMARY: {
    category: "Payment",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
  },
  GET_FOREIGN_FEE: {
    category: "Payment",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
  },
  UPDATE_FOREIGN_FEE: {
    category: "Payment",
    isTx: false,
    requiresApproval: false, // TODO
    isGatewayDisabled: true,
  },
  GET_SERVER_CONNECTION_HISTORY: {
    category: "Payment",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
  },
  SET_CURRENT_FOREIGN_SERVER: {
    category: "Payment",
    isTx: false,
    requiresApproval: false, // TODO
    isGatewayDisabled: true,
  },
  ADD_FOREIGN_SERVER: {
    category: "Payment",
    isTx: false,
    requiresApproval: false, // TODO
    isGatewayDisabled: true,
  },
  REMOVE_FOREIGN_SERVER: {
    category: "Payment",
    isTx: false,
    requiresApproval: false, // TODO
    isGatewayDisabled: true,
  },
  GET_DAY_SUMMARY: {
    category: "Payment",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
  },
  CREATE_TRADE_BUY_ORDER: {
    category: "Payment",
    isTx: true,
    requiresApproval: true, 
    isGatewayDisabled: false,
  },
  CREATE_TRADE_SELL_ORDER: {
    category: "Payment",
    isTx: true,
    requiresApproval: true, 
    isGatewayDisabled: true,
  },
  CANCEL_TRADE_SELL_ORDER: {
    category: "Payment",
    isTx: true,
    requiresApproval: true, 
    isGatewayDisabled: true,
  },
  IS_USING_GATEWAY: {
    category: "System",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
  },
  ADMIN_ACTION: {
    category: "System",
    isTx: false,
    requiresApproval: true,
    isGatewayDisabled: true,
  },
  SIGN_TRANSACTION: {
    category: "Other",
    isTx: true,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  PUBLISH_MULTIPLE_QDN_RESOURCES: {
    category: "Data",
    isTx: true,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  PUBLISH_QDN_RESOURCE: {
    category: "Data",
    isTx: true,
    requiresApproval: true,
    isGatewayDisabled: false,
  },
  ENCRYPT_DATA: {
    category: "Data",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
  },
  OPEN_NEW_TAB: {
    category: "System",
    isTx: false,
    requiresApproval: false,
    isGatewayDisabled: false,
  },
};


export const services = [
  { name: "ARBITRARY_DATA", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "QCHAT_ATTACHMENT", sizeInBytes: 1 * 1024 * 1024, sizeLabel: "1 MB" },
  { name: "ATTACHMENT", sizeInBytes: 50 * 1024 * 1024, sizeLabel: "50 MB" },
  { name: "FILE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "FILES", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "CHAIN_DATA", sizeInBytes: 239, sizeLabel: "239 B" },
  { name: "WEBSITE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "IMAGE", sizeInBytes: 10 * 1024 * 1024, sizeLabel: "10 MB" },
  { name: "THUMBNAIL", sizeInBytes: 500 * 1024, sizeLabel: "500 KB" },
  { name: "QCHAT_IMAGE", sizeInBytes: 500 * 1024, sizeLabel: "500 KB" },
  { name: "VIDEO", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "AUDIO", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "QCHAT_AUDIO", sizeInBytes: 10 * 1024 * 1024, sizeLabel: "10 MB" },
  { name: "QCHAT_VOICE", sizeInBytes: 10 * 1024 * 1024, sizeLabel: "10 MB" },
  { name: "VOICE", sizeInBytes: 10 * 1024 * 1024, sizeLabel: "10 MB" },
  { name: "PODCAST", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "BLOG", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "BLOG_POST", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "BLOG_COMMENT", sizeInBytes: 500 * 1024, sizeLabel: "500 KB" },
  { name: "DOCUMENT", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "LIST", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "PLAYLIST", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "APP", sizeInBytes: 50 * 1024 * 1024, sizeLabel: "50 MB" },
  { name: "METADATA", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "JSON", sizeInBytes: 25 * 1024, sizeLabel: "25 KB" },
  { name: "GIF_REPOSITORY", sizeInBytes: 25 * 1024 * 1024, sizeLabel: "25 MB" },
  { name: "STORE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "PRODUCT", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "OFFER", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "COUPON", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "CODE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "PLUGIN", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "EXTENSION", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "GAME", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "ITEM", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "NFT", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "DATABASE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "SNAPSHOT", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" },
  { name: "COMMENT", sizeInBytes: 500 * 1024, sizeLabel: "500 KB" },
  { name: "CHAIN_COMMENT", sizeInBytes: 239, sizeLabel: "239 B" },
  { name: "MAIL", sizeInBytes: 1 * 1024 * 1024, sizeLabel: "1 MB" },
  { name: "MESSAGE", sizeInBytes: 1 * 1024 * 1024, sizeLabel: "1 MB" }
];

export const privateServices = [
  { name: "QCHAT_ATTACHMENT_PRIVATE", sizeInBytes: 1 * 1024 * 1024, sizeLabel: "1 MB" },
  { name: "ATTACHMENT_PRIVATE", sizeInBytes: 50 * 1024 * 1024, sizeLabel: "50 MB" },
  { name: "FILE_PRIVATE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" }, // Default size
  { name: "IMAGE_PRIVATE", sizeInBytes: 10 * 1024 * 1024, sizeLabel: "10 MB" },
  { name: "VIDEO_PRIVATE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" }, // Default size
  { name: "AUDIO_PRIVATE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" }, // Default size
  { name: "VOICE_PRIVATE", sizeInBytes: 10 * 1024 * 1024, sizeLabel: "10 MB" },
  { name: "DOCUMENT_PRIVATE", sizeInBytes: 500 * 1024 * 1024, sizeLabel: "500 MB" }, // Default size
  { name: "MAIL_PRIVATE", sizeInBytes: 5 * 1024 * 1024, sizeLabel: "5 MB" },
  { name: "MESSAGE_PRIVATE", sizeInBytes: 1 * 1024 * 1024, sizeLabel: "1 MB" }
];
