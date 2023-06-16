import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <>
      <footer className="pb-2">
        <p>
          <a href="https://github.com/shubsmastan">
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
        </p>
      </footer>
    </>
  );
}
