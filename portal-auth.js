(()=>{
'use strict';
const NAME='Felix Montoya', ADMIN_ID='83dd62d7-1338-4cc4-aa17-639e6cd8b8b6', KEY='portalsmo-admin-auth-v1';
let verified=false, client=null, loading=null;
const ls=localStorage;
function clearPortal(){
    for(const k of ['usuarioPortal','adminPortal','permisoDashboards','sesionActiva','tipoUsuario'])ls.removeItem(k);
    verified=false;
    }
function candidate(){
    return ls.getItem('usuarioPortal')===NAME && ls.getItem('tipoUsuario')!=='INVITADO';
    }
function isAdmin(){
    return verified && candidate();
    }
async function getClient(){
    if(client)return client;
    if(!loading)loading=(async()=>{
      if(!window.supabase?.createClient){
        await new Promise((resolve,reject)=>{
          const s=document.createElement('script');
          s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
          s.onload=resolve;
          s.onerror=reject;
          document.head.append(s);
          }
        );
        }
      return client=window.supabase.createClient('https://mefshrfkdtmvfrcpzumi.supabase.co','sb_publishable_l5ePHIP97cfvmMIKQw9Ilg_7KnK94Ty',{
        auth:{
          storageKey:KEY,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
        }
      );
      }
    )();
    try{
      return await loading;
      }
    catch(e){
      loading=null;
      throw e;
      }
    }
function valid(u){
    return u?.app_metadata?.portal_role==='admin' && u.id===ADMIN_ID;
    }
async function check(){
    if(!candidate()){
      verified=false;
      ls.setItem('adminPortal','false');
      return false;
      }
    try{
      const c=await getClient();
      const {
        data,error}
      =await c.auth.getUser();
      if(error||!valid(data.user))throw Error('Sesión administrativa inválida');
      verified=true;
      ls.setItem('adminPortal','true');
      ls.setItem('permisoDashboards','true');
      return true;
      }
    catch(e){
      clearPortal();
      return false;
      }
    }
async function login(email,password){
    const c=await getClient();
    const {
      data,error}
    =await c.auth.signInWithPassword({
      email,password}
    );
    if(error||!valid(data.user)){
      verified=false;
      if(!error)await c.auth.signOut({
        scope:'local'}
      );
      throw Error('Acceso administrativo denegado');
      }
    verified=true;
    }
async function logout(){
    const had=verified||candidate()||!!ls.getItem(KEY);
    clearPortal();
    if(had){
      try{
        const c=await getClient();
        await c.auth.signOut({
          scope:'local'}
        );
        }
      catch(e){
        }
      finally{
        ls.removeItem(KEY);
        }
      }
    }
function watch(){
    window.addEventListener('storage',e=>{
      if(verified&&(e.key===null||e.key==='usuarioPortal'||e.key===KEY)){
        if(!candidate()||!ls.getItem(KEY)){
          verified=false;
          location.replace('index.html');
          }
        }
      }
    );
    window.addEventListener('pageshow',e=>{
      if(e.persisted&&verified)location.reload();
      }
    );
    }
const roles = Object.freeze({
  "ANGEL MORENO": "CALIDAD",
  "ANTONIO BADILLO": "CALIDAD",
  "ARIADNA ROSAS": "CALIDAD",
  "CARLOS CRUZ": "CALIDAD",
  "DANIELA MARTINEZ": "CALIDAD",
  "EDITH PEREZ": "CALIDAD",
  "EDUARDO NAVA": "CALIDAD",
  "GABRIELA ALVARADO": "CALIDAD",
  "GREGORIO PEREZ": "CALIDAD",
  "IVAN COXANTEJE": "CALIDAD",
  "JESUS GONZALEZ": "CALIDAD",
  "LILIANA SOTELO": "CALIDAD",
  "MANUEL CHAGALA": "CALIDAD",
  "NATALIA JUAREZ": "CALIDAD",
  "ROSA ESPINO": "CALIDAD",
  "SAMANTHA GONZALEZ": "CALIDAD",
  "SARA POZOS": "CALIDAD",
  "VALERIA FUENTES": "CALIDAD",
  "YIREL PREN": "CALIDAD",
  "COORDINADOR A": "OPERACIONES",
  "COORDINADOR B": "OPERACIONES",
  "COORDINADOR C": "OPERACIONES",
  "COORDINADOR D": "OPERACIONES",
  "HS&E A": "HS&E",
  "HS&E B": "HS&E",
  "HS&E C": "HS&E",
  "HS&E D": "HS&E",
  "ANALISTA QA1": "CALIDAD",
  "ANALISTA QA2": "CALIDAD",
  "ANALISTA QA3": "CALIDAD",
  "ANALISTA QA4": "CALIDAD",
  "PAOLA RAMIREZ": "VISUALIZADOR",
  "ROGELIO SOTO": "VISUALIZADOR",
  "VICTOR ORTIZ": "VISUALIZADOR",
  "JUAN ROQUE": "VISUALIZADOR",
  "JIMENA VELASCO": "VISUALIZADOR",
  "PABLO BECERRA": "VISUALIZADOR",
  "JULIO ARAIZA": "VISUALIZADOR",
  "TRANSPORTE": "VISUALIZADOR",
  "YOLEANA VALENCIANO": "VISUALIZADOR",
  "DIEGO TRUJILLO": "VISUALIZADOR",
  "ALAIN CLETO": "VISUALIZADOR",
  "GUILLERMO MOLINA": "VISUALIZADOR",
  "OMAR MENDOZA": "VISUALIZADOR"
}
  );
function role(){
 if(isAdmin()) return 'ADMIN';
 if(ls.getItem('tipoUsuario')==='INVITADO') return 'INVITADO';
 const name=ls.getItem('usuarioPortal');
 try{
      const session=JSON.parse(ls.getItem('sesionActiva')||'null');
      if(session?.datos?.nombre!==name)return '';
      }
    catch(e){
      return '';
      }
 return Object.prototype.hasOwnProperty.call(roles,name)?roles[name]:'';
}
const access = Object.freeze({
 'index.html':['ADMIN','CALIDAD','OPERACIONES','HS&E','VISUALIZADOR','INVITADO',''],
 'alertas de calidad.html':['ADMIN','CALIDAD','OPERACIONES','HS&E','VISUALIZADOR','INVITADO'],
 'auditoria recibo.html':['ADMIN','CALIDAD'],
 'incidencia en recibo.html':['ADMIN','CALIDAD'],
 'auditorias embarques.html':['ADMIN','CALIDAD','OPERACIONES'],
 'dashboard.html':['ADMIN','VISUALIZADOR'],
 'dashboard-auditorias.html':['ADMIN','VISUALIZADOR'],
 'dashboard-incidencias.html':['ADMIN','VISUALIZADOR'],
 'dashboard_quejas.html':['ADMIN','VISUALIZADOR'],
 'dashboard-quejas recibo.html':['ADMIN','VISUALIZADOR'],
 'dds-qa-smo.html':['ADMIN','VISUALIZADOR'],
 'respaldo-almacenamiento.html':['ADMIN']
}
  );
function canAccess(path){
    return (access[decodeURIComponent(path).split('/').pop().toLowerCase()]||[]).includes(role());
    }
window.PortalAuth=Object.freeze({
    isAdmin,login,logout,check,watch,role,canAccess,
    analyticsClient:()=>{
      if(!isAdmin()||!client)throw Error("Sesión administrativa requerida");
      return client;
    }}
  );
window.PortalAuthRender=async html=>{
    await check();
    if(!canAccess(location.pathname.split("/").pop()||"index.html")){
      location.replace("index.html");
      return;
      }
    document.open();
    document.write(html);
    document.close();
    }
  ;
}
)();