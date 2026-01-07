export default function FooterBottom() {
  return (
    <div className="border-t-0 border-gray-300 p-3 text-start text-sm text-gray-500 sticky bottom-0 ">
      &copy; {new Date().getFullYear()} Embassy System. All rights reserved.
    </div>
  );
}
