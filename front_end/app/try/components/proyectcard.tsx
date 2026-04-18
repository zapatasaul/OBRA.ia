import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import CardImage from "./CardImage.png";

export default function ProyectCard() {
    return (
        <Card className="w-2/6 m-5 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <CardHeader className="h-1 bg-gray-700" />
            <div className="flex flex-row justify-center">
                <Image src={CardImage} alt="Proyecto 1" width={400} height={400} />
            </div>
            <CardBody className="p-5">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Proyecto 1</h3>
                <p className="text-sm text-slate-600">Avendia Las Torres, 6666</p>
                <p className="text-sm text-slate-600">Ciudad de México, C.P. 06600</p>
                <p className="text-sm text-slate-400 mt-4">12 de junio de 2024</p>
            </CardBody>
            <CardFooter className="p-6 border-t border-slate-200">
                <button className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                    Ver detalles
                </button>
            </CardFooter>
        </Card>
    );
}