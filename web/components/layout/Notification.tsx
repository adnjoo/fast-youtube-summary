export type NotificationProps = {
  isVisible: boolean;
  text?: string;
};

export function Notification({
  isVisible,
  text = 'URL copied to clipboard!',
}: NotificationProps) {
  return isVisible ? (
    <div className='fixed bottom-10 right-10 rounded-lg bg-green-500 px-4 py-2 text-sm text-white opacity-100 shadow-lg transition-opacity duration-300 animate-in'>
      {text}
    </div>
  ) : null;
}
