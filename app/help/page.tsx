export default function Help() {
	const faqs = [
		{
			q: "¿Qué es una Jam Session?",
			a: "Es un encuentro musical donde músicos tocan juntos. A veces es totalmente libre, otras se toca una canción conocida previamente, y otras es un mix de ambos estilos.",
		},
		{
			q: "¿Dónde se realizan estas sesiones?",
			a: "Lo más común son bares, salas de conciertos o locales especializados en música, aunque también pueden hacerse en espacios abiertos o estudios.",
		},
		{
			q: "¿Qué debo llevar?",
			a: "Tu instrumento, aunque a veces los Jamspots dejan instrumentos disponibles en el lugar, y muchas ganas de tocar.",
		},
		{
			q: "Normas básicas",
			a: "Respeta los turnos, no interrumpas a otros músicos y respeta la decisión de quien lleva la jam, incluso aunque creas que se equivoca.",
		},
	];

	return (
		<div className="w-[1300px] max-w-[90%] mx-auto p-6">
			<div className="inline-block">
				<div className="ml-3 flex gap-2 items-end">
					<img src="jamspots_icon.png" alt="Jamspots icon" className="h-16" />
					<p className="text-xs py-3 text-gray-600 font-semibold">
						Find the next spot where music happens.
					</p>
				</div>
			</div>
			<div className="p-12 max-w-3xl mx-auto">
				<h1 className="text-2xl font-semibold mb-6 text-center">Help / FAQ</h1>
				<div className="flex flex-col gap-4">
					{faqs.map((item, i) => (
						<div key={i} className="border rounded p-4 bg-gray-50">
							<p className="font-semibold">{item.q}</p>
							<p className="mt-1 text-gray-700">{item.a}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
