const allHistoryTypes = [
  'createApartment',
  'updateApartment',
  'deleteApartment',
  'archiveApartment',
  'restoreApartment',
  'createOrder',
  'cancelOrder',
  'updateOrder',
  'updateOrderStatus',
  'approveStatusChange',
  'declineStatusChange',
  'deleteOrder',
  'archiveOrder',
  'restoreOrder',
  'createManager',
  'updateManager',
  'deleteManager',
  'archiveManager',
  'restoreManager',
];
const allOrderTypes = ['barter', 'rent', 'cancel', 'purchase', 'mortgage'];
const allNotificationTypes = ['cancel', 'barter', 'rent', 'purchase', 'mortgage'];

export const historyTypes: string[] = allHistoryTypes;
export const orderTypes: string[] = allOrderTypes;
export const notificationTypes: string[] = allNotificationTypes;
