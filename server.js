const http=require("http"),fs=require("fs"),path=require("path"),crypto=require("crypto");
const PORT=Number(process.env.PORT||3000),ROOT=__dirname,PUBLIC=path.join(ROOT,"public"),DATA=path.join(ROOT,"data","alerts.json");
fs.mkdirSync(path.dirname(DATA),{recursive:true});if(!fs.existsSync(DATA))fs.writeFileSync(DATA,"[]");
const read=()=>{try{return JSON.parse(fs.readFileSync(DATA,"utf8"))}catch{return []}};
const send=(r,s,o)=>{r.writeHead(s,{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type, X-Alert-Key","Cache-Control":"no-store"});r.end(JSON.stringify(o))};
const text=(v,n=500)=>String(v??"").trim().slice(0,n);
const server=http.createServer(async(req,res)=>{
 const u=new URL(req.url,"http://localhost");
 if(req.method==="OPTIONS"){res.writeHead(204,{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type, X-Alert-Key"});return res.end()}
 if(u.pathname==="/api/health"&&req.method==="GET")return send(res,200,{ok:true,mode:"demo",note:"No detecta peligros reales"});
 if(u.pathname==="/api/alerts"&&req.method==="GET")return send(res,200,{alerts:read().slice(0,Math.min(100,Number(u.searchParams.get("limit")||30)))});
 if(u.pathname==="/api/alerts"&&req.method==="POST"){
  if(process.env.ALERT_API_KEY&&req.headers["x-alert-key"]!==process.env.ALERT_API_KEY)return send(res,401,{error:"Clave inválida"});
  try{
   let raw="";for await(const c of req)raw+=c;if(raw.length>100000)throw Error("Solicitud demasiado grande");
   const x=JSON.parse(raw||"{}"),types=["normal","inundacion","deslave","inundacion_y_deslave"];
   if(!types.includes(x.alert_type))throw Error("Tipo de alerta no válido");
   for(const k of ["rain_mm_h","water_level_cm"])if(x[k]!=null&&(!Number.isFinite(Number(x[k]))||Number(x[k])<0))throw Error("Valores numéricos no válidos");
   const a={id:crypto.randomUUID(),timestamp:new Date().toISOString(),test:x.test!==false,location:text(x.location||"Ubicación no especificada",180),alert_type:x.alert_type,message:text(x.message||"Evento de prueba"),rain_mm_h:x.rain_mm_h==null?null:Number(x.rain_mm_h),water_level_cm:x.water_level_cm==null?null:Number(x.water_level_cm)};
   const all=read();all.unshift(a);fs.writeFileSync(DATA,JSON.stringify(all.slice(0,1000),null,2));return send(res,201,{ok:true,alert:a});
  }catch(e){return send(res,400,{error:e.message||"Solicitud inválida"})}
 }
 if(req.method==="GET"){
  let f=path.resolve(PUBLIC,u.pathname==="/"?"index.html":decodeURIComponent(u.pathname).replace(/^\/+/,""));
  if(!f.startsWith(PUBLIC+path.sep)&&f!==path.join(PUBLIC,"index.html")){res.writeHead(403);return res.end("Forbidden")}
  return fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);return res.end("No encontrado")}const ext=path.extname(f);res.writeHead(200,{"Content-Type":({".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json"}[ext]||"text/plain; charset=utf-8"),"Cache-Control":"no-store"});res.end(b)})
 }
 send(res,404,{error:"Ruta no encontrada"})
});
server.listen(PORT,"0.0.0.0",()=>console.log("Alerta Comunitaria: http://localhost:"+PORT));
