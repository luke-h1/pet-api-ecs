export default function AlertInput({
  children,
}: {
  children: React.ReactNode;
}) {
  return children ? (
    <span role="alert" style={{ color: 'tomato' }}>
      {children}
    </span>
  ) : null;
}
