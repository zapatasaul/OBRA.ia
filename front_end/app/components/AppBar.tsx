import Image from "next/image";
import Profile from "./Logo.png";

export default function AppBar() {
    return (
        <header className="w-full bg-gray-50 h-14 flex items-center px-8 shrink-0 shadow-md flex-row">
            <Image
                src={Profile}
                alt="Logo de OBRA.AI"
                width={50}
                height={50}
                className="mr-3"
            />
            <span className="text-gray-900 text-xl font-black tracking-widest">
                OBRA.AI
            </span>
        </header>
    );
}