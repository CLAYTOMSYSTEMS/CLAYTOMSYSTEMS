import { create } from "xmlbuilder2";
export async function POST(){
  const twiml = create({ version:"1.0" })
    .ele("Response")
      .ele("Say",{ voice:"Polly.Conchita" }).txt("Hola, soy Sandra. ¿En qué puedo ayudarte? Puedes interrumpirme hablando.").up()
      .ele("Gather",{ input:"speech", language:"es-ES", bargeIn:"true", action:"/api/chat", method:"POST", speechTimeout:"auto" })
        .ele("Say",{ voice:"Polly.Conchita" }).txt("Te escucho.").up()
      .up()
    .up().end({ prettyPrint:false });
  return new Response(twiml, { headers:{ "Content-Type":"text/xml" }});
}
