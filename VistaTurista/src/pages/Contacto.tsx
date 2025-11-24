import { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Mail, User, MessageSquare } from "lucide-react";

const Contacto = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
    alert("Gracias por tu mensaje. Nos pondremos en contacto pronto.");
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[#f5f7f2] to-white">
      <Navigation />

      <main className="container mx-auto px-4 pt-28 pb-16">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2A624C] mb-4">Contáctanos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Si tienes dudas, sugerencias o quieres más información sobre los
            patrimonios de Tomé, completa el formulario y te responderemos.
          </p>
        </div>

        {/* Formulario */}
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-xl bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            {/* Nombre */}
            <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-[#2A624C]">
              <User className="text-[#2A624C] mr-2" size={20} />
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-[#2A624C]">
              <Mail className="text-[#2A624C] mr-2" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Tu correo"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>

            {/* Mensaje */}
            <div className="flex items-start border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-[#2A624C]">
              <MessageSquare className="text-[#2A624C] mr-2 mt-2" size={20} />
              <textarea
                name="mensaje"
                placeholder="Escribe tu mensaje..."
                value={form.mensaje}
                onChange={handleChange}
                className="w-full outline-none h-32 resize-none"
                required
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-[#2A624C] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#24523f] transition-colors"
            >
              Enviar mensaje
            </button>
          </form>
        </div>

        {/* Mapa embebido */}
        <div className="mt-16 flex justify-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.123456789!2d-72.9500!3d-36.6167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9669c7c123456789%3A0xabcdef123456789!2sTom%C3%A9%2C%20Biob%C3%ADo%2C%20Chile!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md max-w-4xl"
          ></iframe>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contacto;
