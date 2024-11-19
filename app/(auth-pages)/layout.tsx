export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex items-center py-20">
      {children}
    </div>
  );
  
}
