import { Link } from "@tanstack/react-router"
import Button from "./Button"
import CtaBanner from "./CtaBanner"

// Shown under every stage group on the speakers page.
const SpeakersCtaBanner = ({ title }: { title: string }) => {
    return (
        <CtaBanner variant="card" title={title} subtitle="Ask your questions in the live Q&A">
            <Link to="/checkout">
                <Button className="px-10" label="Get Your Pass – $295" />
            </Link>
        </CtaBanner>
    )
}

export default SpeakersCtaBanner
