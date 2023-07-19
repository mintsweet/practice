export function Footer() {
  return (
    <footer className="fixed right-0 bottom-0 left-0">
      <ul className="flex justify-center items-center">
        <li className="mr-4">
          <a
            href="https://github.com/mintsweet/practice"
            target="_blank"
            rel="noreferrer"
            className="text-green-600 hover:text-green-700"
          >
            GitHub
          </a>
        </li>
      </ul>
      <p className="text-center text-gray-400 text-sm">
        2019-2023 All Rights Reserved
      </p>
    </footer>
  );
}
