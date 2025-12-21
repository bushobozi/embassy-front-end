export default function FooterBottom() {
  return (
    <div className="border-t border-gray-300 p-3 text-center text-sm text-gray-500 sticky bottom-0 ">
      &copy; {new Date().getFullYear()} Embassy System. All rights reserved.
    </div>
  );
}
