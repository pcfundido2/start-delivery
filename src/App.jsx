const LOGO_START = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAYAAABS39xVAABQtElEQVR42u2deXxU1fn/P+ece++s2UkCAQQKCgQVkEVAJCzuShUsilsXa7VirUu1/bZWg9ra/uzX1rauVeu+lEVlkV0WRQUU3FFA2QVCCCHbbPee8/z+uPdOboaAbb9WbXner1dqOpkMM5OZz3ye5zwLoNFoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0mn8boaqurub6WdBoNF97li1bZgDA008/ff3kyZPXADA452iLDhE1Gs3XHkbg9OnT553zt1fXUUVFhQ2gG2MMAHSIqNFovh5UVVUZAHDUkX3HvfPuu/byFcslgJbS0tKe3lW0YGk0mq+HWAkh0O/IfvMXLFiwn4jktddeKxlj+0eMGFHhXU2HhBqN5qulqqrKAICjjuo37p133rWXr1guAbSUlpb29K6iQ0SNRvP1oKqqygCAo47qN+6dd96xl69YLgG0lJaW9vSuokNCjUbz5cKICMaYQOswr0NlZeXrTzz5xPm9e/fuW1JS0snbHqB0SKjRaL5q4r369Hk0Vlb2cnxg/2dKj+u/oOuokRf3O+nE//Hu0SGhRqP58vlk+/be6brkUFmZNDOZ0vSeQ1XJpQu+0a93ryeo9ZNHC5ZGo/lqMQzj1cFnnzPp+IcfRnDmF2dLh7w0bdT3v3eVd5MWLI1G89WzbevWmm6jzlAlEy8E4xz1y5Yjs2cP+t98EwoGDQy6T4eEGo3mq6WycuClN9907Y6dmzc1m1aIDtTU0ifvvVe8b9MmAtBE3o9q0dJoNF8tFRUVF992z21fbT399LU9Tjj+JctxqOM3v0nFXTu/Yp50DZZGo/k6sfedd0sb334nWvbDS5IFYTuVTKaIcw4o1cI4D6V37szP69OnodFhoUaj+ZqQ29Mz3DZNyVrSqUw8VsR79uxFqWQK6XSGRcOh2vXrPzCgQ0KNRvN1onTGVfayhf+0AaCQiBR0WKjRaL4ucM4UEakkkWDQzkqj0Xydw0LBOBdaqDQazTcm5NMOS6PRfFOEi1qwNBqNRoeFGo1G87+CFiyNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Go3m0/M/JTJW";

import { useState, useEffect, useRef } from "react";
import {
  buscarEmpresas, criarEmpresa, atualizarEmpresa, excluirEmpresa,
  buscarPedidos, criarPedido, atualizarPedido,
  buscarEntregadorPorTelefone, salvarEntregador,
  escutarPedidos, escutarEmpresas,
} from "./data";

const ORANGE="#FF6B1A", ORANGE_DEEP="#E85D04", GREEN="#10B981", RED="#EF4444", BLUE="#3B82F6";
const BORDER="var(--color-border-tertiary)", TEXT="var(--color-text-primary)";
const MUTED="var(--color-text-secondary)", BG="var(--color-background-primary)", BG2="var(--color-background-secondary)";

function playPlim(freq=880){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.type="sine";
    o.frequency.setValueAtTime(freq,ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq/2,ctx.currentTime+0.3);
    g.gain.setValueAtTime(0.3,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.5);
    o.start();o.stop(ctx.currentTime+0.5);
  }catch(_){}
}

const hoje = new Date().getDay();
const isTerca = hoje === 2;

const CATS=["Todos","Restaurante","Doceria","Mercearia","Farmácia","Cosméticos","Variados"];


// ── primitivos ────────────────────────────────────────────────────────────────
function Badge({color,text}){
  return <span style={{background:color+"22",color,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99,border:`1px solid ${color}44`,whiteSpace:"nowrap"}}>{text}</span>;
}

function Btn({onClick,children,variant="primary",size="md",disabled=false,full=false,style={}}){
  const pad={sm:"6px 14px",md:"10px 20px",lg:"13px 26px"};
  const fs={sm:12,md:14,lg:15};
  const bg={
    primary:{background:`linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DEEP} 100%)`,color:"#fff",border:"none",boxShadow:`0 2px 10px ${ORANGE}40`},
    secondary:{background:BG2,color:TEXT,border:`1px solid ${BORDER}`},
    ghost:{background:"transparent",color:ORANGE,border:`1px solid ${ORANGE}55`},
    danger:{background:RED,color:"#fff",border:"none"},
    green:{background:GREEN,color:"#fff",border:"none",boxShadow:`0 2px 10px ${GREEN}40`},
  };
  return(
    <button
      onClick={disabled?undefined:onClick}
      className="st-btn"
      style={{cursor:disabled?"not-allowed":"pointer",borderRadius:10,fontWeight:600,
        padding:pad[size],fontSize:fs[size],width:full?"100%":"auto",
        opacity:disabled?.45:1,...bg[variant],...style}}>
      {children}
    </button>
  );
}

function Input({label,placeholder,value,onChange,type="text",hint,onKeyDown}){
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",marginBottom:5,fontSize:12,fontWeight:600,color:TEXT}}>{label}</label>}
      {hint&&<p style={{margin:"0 0 5px",fontSize:11,color:MUTED}}>{hint}</p>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDown} className="st-input"
        style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1px solid ${BORDER}`,
          background:BG2,color:TEXT,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
    </div>
  );
}

function Card({children,style={}}){
  return <div className="st-fade-in" style={{background:BG,border:`1px solid ${BORDER}`,borderRadius:14,padding:"1.1rem 1.25rem",...style}}>{children}</div>;
}

// Card clicável como <button> — resolve o problema de onClick em div
function ClickCard({children,onClick,style={}}){
  return(
    <button onClick={onClick} className="st-fade-in st-click-card"
      style={{display:"block",width:"100%",textAlign:"left",background:BG,border:`1px solid ${BORDER}`,
        borderRadius:14,padding:"1.1rem 1.25rem",cursor:"pointer",marginBottom:12,...style}}>
      {children}
    </button>
  );
}

function StarRating({val=0}){
  const full=Math.floor(val),half=val-full>=0.5,empty=5-full-(half?1:0);
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:3}}>
      <span style={{color:"#F59E0B",fontSize:13}}>{"★".repeat(full)}{half?"½":""}{"☆".repeat(empty)}</span>
      <span style={{color:MUTED,fontSize:12,fontWeight:500}}>{val.toFixed(1)}</span>
    </span>
  );
}

function Toast({msg,color=GREEN}){
  if(!msg)return null;
  return(
    <div className="st-toast" style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",
      background:color,color:"#fff",padding:"12px 22px",borderRadius:12,fontWeight:600,
      fontSize:14,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 8px 28px rgba(0,0,0,0.25)",
      pointerEvents:"none"}}>
      {msg}
    </div>
  );
}

function useToast(){
  const [msg,setMsg]=useState("");
  const [color,setColor]=useState(GREEN);
  function show(m,c=GREEN){setMsg(m);setColor(c);setTimeout(()=>setMsg(""),3500);}
  return {msg,color,show};
}

// ════════════════════════════════════════════════════════════════════
// 1. PORTAL DO CLIENTE
// ════════════════════════════════════════════════════════════════════
function PortalCliente({empresas}){
  const [cat,setCat]=useState("Todos");
  const [busca,setBusca]=useState("");
  const [detalhe,setDetalhe]=useState(null);
  const t=useToast();

  const lista=empresas.filter(e=>
    (cat==="Todos"||e.cats.includes(cat))&&
    (e.nome.toLowerCase().includes(busca.toLowerCase())||e.cats.some(c=>c.toLowerCase().includes(busca.toLowerCase())))
  );

  function pedirWhatsApp(empresa){
    playPlim();
    const msg=encodeURIComponent(
      `🛵 *Pedido via Start Delivery*\n\nOlá, ${empresa.nome}! Vim pelo site da *Start Delivery* e quero fazer um pedido.\n\nPode me enviar o cardápio? 😊\n\n_Start Delivery · Montividiu/GO_`
    );
    window.open(`https://wa.me/${empresa.whatsapp}?text=${msg}`,"_blank");
    t.show(`✅ WhatsApp de ${empresa.nome} aberto!`);
  }

  // tela de contatos
  if(detalhe){
    return(
      <div className="st-screen" style={{maxWidth:480,margin:"0 auto",paddingBottom:"2rem"}}>
        <Toast msg={t.msg} color={t.color}/>
        <div style={{background:`linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DEEP} 100%)`,padding:"1.5rem"}}>
          <button onClick={()=>setDetalhe(null)} className="st-back-btn"
            style={{background:"rgba(255,255,255,0.18)",border:"none",color:"#fff",borderRadius:9,
              padding:"6px 14px",fontSize:13,cursor:"pointer",marginBottom:14,fontWeight:500}}>
            ← Voltar
          </button>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:62,height:62,borderRadius:16,background:"rgba(255,255,255,0.18)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0,
              boxShadow:"0 6px 18px rgba(0,0,0,0.15)"}}>
              {detalhe.emoji}
            </div>
            <div>
              <h2 style={{margin:0,color:"#fff",fontSize:20,fontWeight:700}}>{detalhe.nome}</h2>
              <p style={{margin:"3px 0 0",color:"rgba(255,255,255,0.85)",fontSize:13}}>{detalhe.cats.join(" · ")}</p>
              <div style={{display:"flex",gap:14,marginTop:5,alignItems:"center"}}>
                <StarRating val={detalhe.avaliacao||0}/>
                {detalhe.tempoMin&&<span style={{color:"rgba(255,255,255,0.92)",fontSize:12}}>🕐 {detalhe.tempoMin}–{detalhe.tempoMax} min</span>}
              </div>
            </div>
          </div>
        </div>

        {detalhe.obs&&(
          <div className="st-fade-in" style={{margin:"1.25rem 1.25rem 0",background:RED+"12",border:`1px solid ${RED}44`,borderRadius:11,padding:"0.9rem 1rem"}}>
            <p style={{margin:0,fontWeight:600,fontSize:13,color:RED}}>{detalhe.obs}</p>
          </div>
        )}
        <div className="st-fade-in" style={{margin:"1rem 1.25rem 0",background:ORANGE+"12",border:`1px solid ${ORANGE}33`,borderRadius:11,padding:"0.9rem 1rem"}}>
          <p style={{margin:"0 0 3px",fontWeight:600,fontSize:13,color:ORANGE}}>Como funciona?</p>
          <p style={{margin:0,fontSize:12,color:MUTED,lineHeight:1.6}}>
            Escolha como quer entrar em contato com <strong>{detalhe.nome}</strong>. A empresa te enviará o cardápio e combinam os detalhes do pedido!
          </p>
        </div>

        <div style={{padding:"1.25rem"}}>
          <p style={{margin:"0 0 14px",fontWeight:600,fontSize:14}}>Formas de contato:</p>

          {detalhe.whatsapp&&(
            <button onClick={()=>pedirWhatsApp(detalhe)} className="st-fade-in st-contact-btn"
              style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"16px",
                borderRadius:13,border:`1px solid #25D36633`,background:"#25D36608",
                cursor:"pointer",marginBottom:12,textAlign:"left"}}>
              <div style={{width:44,height:44,borderRadius:12,background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:"0 4px 12px #25D36655"}}>💬</div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontWeight:600,fontSize:15,color:"#128C7E"}}>WhatsApp</p>
                <p style={{margin:"2px 0 0",fontSize:12,color:MUTED}}>Mensagem automática da Start Delivery</p>
              </div>
              <span style={{color:"#25D366",fontSize:20}}>→</span>
            </button>
          )}

          {detalhe.telefone&&(
            <button onClick={()=>window.open(`tel:${detalhe.telefone.replace(/\D/g,"")}`)} className="st-fade-in st-contact-btn"
              style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"16px",
                borderRadius:13,border:`1px solid ${BORDER}`,background:BG2,
                cursor:"pointer",marginBottom:12,textAlign:"left"}}>
              <div style={{width:44,height:44,borderRadius:12,background:BLUE,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:`0 4px 12px ${BLUE}55`}}>📞</div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontWeight:600,fontSize:15}}>Ligar</p>
                <p style={{margin:"2px 0 0",fontSize:12,color:MUTED}}>{detalhe.telefone}</p>
              </div>
              <span style={{color:MUTED,fontSize:20}}>→</span>
            </button>
          )}

          {detalhe.instagram&&(
            <button onClick={()=>window.open(`https://instagram.com/${detalhe.instagram}`,"_blank")} className="st-fade-in st-contact-btn"
              style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"16px",
                borderRadius:13,border:`1px solid #E1306C33`,background:"#E1306C08",
                cursor:"pointer",marginBottom:12,textAlign:"left"}}>
              <div style={{width:44,height:44,borderRadius:12,background:"#E1306C",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:"0 4px 12px #E1306C55"}}>📸</div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontWeight:600,fontSize:15,color:"#E1306C"}}>Instagram</p>
                <p style={{margin:"2px 0 0",fontSize:12,color:MUTED}}>@{detalhe.instagram}</p>
              </div>
              <span style={{color:"#E1306C",fontSize:20}}>→</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // lista de empresas
  return(
    <div className="st-screen" style={{maxWidth:540,margin:"0 auto",paddingBottom:"2rem"}}>
      <Toast msg={t.msg} color={t.color}/>
      <div style={{background:`linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DEEP} 100%)`,padding:"1.75rem 1.5rem 2rem"}}>
        <img src={LOGO_START} alt="Start Delivery" style={{height:44,marginBottom:10,filter:"brightness(0) invert(1)"}}/>
        <p style={{margin:"0 0 2px",color:"rgba(255,255,255,0.82)",fontSize:13}}>Bem-vindo à</p>
        <h1 style={{margin:"0 0 16px",color:"#fff",fontSize:22,fontWeight:700,letterSpacing:-0.5}}>Start Delivery</h1>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15}}>🔍</span>
          <input placeholder="Buscar estabelecimentos..." value={busca} onChange={e=>setBusca(e.target.value)}
            style={{width:"100%",padding:"11px 12px 11px 36px",borderRadius:11,border:"none",
              background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:14,boxSizing:"border-box",outline:"none"}}/>
        </div>
      </div>

      <div style={{padding:"0 1.25rem"}}>
        <div className="st-cat-scroll" style={{display:"flex",gap:8,overflowX:"auto",padding:"1rem 0"}}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className="st-cat-pill"
              style={{flexShrink:0,padding:"7px 16px",borderRadius:99,
                border:`1px solid ${cat===c?ORANGE:BORDER}`,
                background:cat===c?`linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DEEP} 100%)`:BG,
                color:cat===c?"#fff":TEXT,boxShadow:cat===c?`0 3px 10px ${ORANGE}40`:"none",
                fontSize:13,cursor:"pointer",fontWeight:cat===c?600:400}}>
              {c}
            </button>
          ))}
        </div>

        <p style={{margin:"0 0 14px",color:MUTED,fontSize:13}}>{lista.length} estabelecimento{lista.length!==1?"s":""}</p>

        {lista.map(e=>(
          <ClickCard key={e.id} onClick={()=>e.aberto&&setDetalhe(e)}
            style={{opacity:e.aberto?1:0.6,cursor:e.aberto?"pointer":"not-allowed",marginBottom:12}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <div className="st-emoji-box" style={{width:58,height:58,borderRadius:14,background:ORANGE+"18",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0}}>
                {e.emoji}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                  <p style={{margin:0,fontWeight:600,fontSize:15}}>{e.nome}</p>
                  {!e.aberto&&<Badge color={RED} text="Fechado"/>}
                </div>
                {e.obs&&<p style={{margin:"0 0 5px",fontSize:11,color:RED,fontWeight:500}}>{e.obs}</p>}
                <p style={{margin:"0 0 7px",color:MUTED,fontSize:13}}>{e.cats.join(" · ")}</p>
                <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                  {e.avaliacao!=null&&<StarRating val={e.avaliacao}/>}
                  {e.tempoMin!=null&&<span style={{fontSize:12,color:MUTED}}>🕐 {e.tempoMin}–{e.tempoMax} min</span>}
                </div>
              </div>
              <span className="st-chevron" style={{color:ORANGE,fontSize:22,flexShrink:0}}>›</span>
            </div>
          </ClickCard>
        ))}

        {lista.length===0&&(
          <div style={{textAlign:"center",padding:"3rem 1rem",color:MUTED}}>
            <p style={{fontSize:32,margin:"0 0 8px"}}>🔍</p>
            <p style={{fontSize:14}}>Nenhum estabelecimento encontrado</p>
          </div>
        )}
        <div style={{marginTop:"1.5rem",borderTop:`1px solid ${BORDER}`,paddingTop:"1rem",textAlign:"center"}}>
          <p style={{margin:0,color:MUTED,fontSize:12}}>Start Delivery - C&E digital · Montividiu/GO</p>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 2. PAINEL DA EMPRESA
// ════════════════════════════════════════════════════════════════════
function normalizaTel(s){
  return (s||"").replace(/\D/g,"");
}

function PainelEmpresa({pedidos,empresas}){
  const [carregandoLogin,setCarregandoLogin]=useState(true);
  const [empresaId,setEmpresaId]=useState(null);
  const [telLogin,setTelLogin]=useState("");
  const [erroLogin,setErroLogin]=useState("");
  const [tel,setTel]=useState("");
  const [end,setEnd]=useState("");
  const [val,setVal]=useState("");
  const t=useToast();

  const empresa=empresas.find(e=>e.id===empresaId);
  const meusPedidos=pedidos.filter(p=>p.empresaId===empresaId);
  const prevLen=useRef(0);

  // tenta entrar automaticamente com o telefone salvo neste navegador
  useEffect(()=>{
    try{
      const num=localStorage.getItem("st_empresa_telefone");
      if(num){
        const encontrada=empresas.find(e=>normalizaTel(e.whatsapp)===num||normalizaTel(e.telefone).endsWith(num.slice(-8)));
        if(encontrada) setEmpresaId(encontrada.id);
      }
    }catch(_){
      // navegador bloqueando localStorage (raro) — sem problema, só não loga automático
    }
    setCarregandoLogin(false);
  },[empresas]);

  useEffect(()=>{
    if(empresa&&meusPedidos.length>prevLen.current){
      playPlim(660);
      t.show("🔔 Novo pedido chegou!",ORANGE);
    }
    prevLen.current=meusPedidos.length;
  },[meusPedidos.length,empresa]);

  function entrar(){
    const num=normalizaTel(telLogin);
    if(!num){ setErroLogin("Digite o telefone cadastrado da empresa"); return; }
    const encontrada=empresas.find(e=>normalizaTel(e.whatsapp)===num||normalizaTel(e.telefone).endsWith(num.slice(-8)));
    if(!encontrada){
      setErroLogin("Telefone não encontrado. Esse número precisa ser o mesmo cadastrado pela Start Delivery para sua empresa.");
      return;
    }
    setErroLogin("");
    setTelLogin("");
    setEmpresaId(encontrada.id);
    try{ localStorage.setItem("st_empresa_telefone",num); }catch(_){}
    t.show(`✅ Bem-vindo(a), ${encontrada.nome}!`);
  }

  function sair(){
    setEmpresaId(null);
    try{ localStorage.removeItem("st_empresa_telefone"); }catch(_){}
  }

  async function enviar(){
    if(!tel.trim()||!end.trim()){
      t.show("⚠️ Informe o telefone e o endereço",RED); return;
    }
    const valorNum=val.trim()?parseFloat(val.replace(",","."))||0:null;
    const novoPedido={
      empresaId,
      empresaNome:empresa.nome,
      empresaEmoji:empresa.emoji,
      telefoneCliente:tel.trim(),
      endereco:end.trim(),
      valor:valorNum,
      pagarNaEntrega:valorNum===null,
      status:"aguardando_entregador",
      hora:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),
      data:new Date().toLocaleDateString("pt-BR"),
    };
    try{
      await criarPedido(novoPedido);
      setTel(""); setEnd(""); setVal("");
      t.show("✅ Pedido enviado para os entregadores!");
    }catch(_){
      t.show("⚠️ Erro ao enviar pedido. Tente novamente.",RED);
    }
  }

  // ── tela: login por telefone ──────────────────────────────────────
  if(carregandoLogin){
    return <div style={{minHeight:"40vh"}}/>;
  }
  if(!empresaId){
    return(
      <div className="st-screen" style={{maxWidth:420,margin:"0 auto",padding:"2rem 1.5rem"}}>
        <Toast msg={t.msg} color={t.color}/>
        <div style={{textAlign:"center",marginBottom:28}}>
          <span style={{fontSize:44}}>🏪</span>
          <h2 style={{margin:"12px 0 4px",fontSize:18}}>Painel da Empresa</h2>
          <p style={{color:MUTED,fontSize:13,margin:0}}>Entre com o telefone cadastrado da sua empresa</p>
        </div>
        <Card style={{border:`1px solid ${ORANGE}44`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:38,height:38,borderRadius:11,background:ORANGE+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🔒</div>
            <div>
              <p style={{margin:0,fontWeight:600,fontSize:14,color:ORANGE}}>Acesso protegido</p>
              <p style={{margin:"1px 0 0",color:MUTED,fontSize:12}}>Só o telefone da empresa entra no painel</p>
            </div>
          </div>
          <Input label="📞 Telefone da empresa" placeholder="(64) 99999-0000" value={telLogin}
            onChange={e=>{setTelLogin(e.target.value);setErroLogin("");}} onKeyDown={e=>e.key==="Enter"&&entrar()}/>
          {erroLogin&&(
            <p style={{margin:"-4px 0 14px",color:RED,fontSize:12,lineHeight:1.5}}>⚠️ {erroLogin}</p>
          )}
          <Btn onClick={entrar} full>Entrar no painel</Btn>
          <p style={{textAlign:"center",color:MUTED,fontSize:11,margin:"12px 0 0",lineHeight:1.5}}>
            Esse número é o mesmo cadastrado pela Start Delivery para sua empresa.<br/>Você só precisa digitar uma vez neste dispositivo.
          </p>
        </Card>
      </div>
    );
  }

  // ── tela: formulário de pedido ────────────────────────────────────
  const pendentes=meusPedidos.filter(p=>p.status==="aguardando_entregador");
  const emRota   =meusPedidos.filter(p=>p.status==="em_rota");
  const entregues=meusPedidos.filter(p=>p.status==="entregue");

  return(
    <div className="st-screen" style={{maxWidth:500,margin:"0 auto",padding:"1.5rem"}}>
      <Toast msg={t.msg} color={t.color}/>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:32}}>{empresa.emoji}</span>
          <div>
            <h2 style={{margin:0,fontSize:17}}>{empresa.nome}</h2>
            <p style={{margin:"2px 0 0",color:MUTED,fontSize:12}}>Painel de Pedidos</p>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <Badge color={GREEN} text="● Online"/>
          <Btn size="sm" variant="secondary" onClick={sair}>Sair</Btn>
        </div>
      </div>

      {/* stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}}>
        {[[pendentes.length,"⏳","Aguardando",ORANGE],[emRota.length,"🛵","Em rota",BLUE],[entregues.length,"✅","Entregues",GREEN]].map(([v,i,l,c])=>(
          <div key={l} className="st-stat-box" style={{background:BG2,borderRadius:12,padding:"0.9rem",textAlign:"center",border:`1px solid ${c}22`}}>
            <p style={{margin:0,fontSize:20}}>{i}</p>
            <p style={{margin:"4px 0 2px",fontSize:22,fontWeight:700,color:c}}>{v}</p>
            <p style={{margin:0,color:MUTED,fontSize:11}}>{l}</p>
          </div>
        ))}
      </div>

      {/* formulário */}
      <Card style={{marginBottom:22,border:`1px solid ${ORANGE}44`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{width:38,height:38,borderRadius:11,background:ORANGE+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📋</div>
          <div>
            <p style={{margin:0,fontWeight:600,fontSize:14,color:ORANGE}}>Anotar pedido → Entregador</p>
            <p style={{margin:"1px 0 0",color:MUTED,fontSize:12}}>Dados que o cliente passou</p>
          </div>
        </div>

        <Input label="📞 Número do cliente *" placeholder="(64) 99999-0000" value={tel} onChange={e=>setTel(e.target.value)}/>
        <Input label="📍 Endereço de entrega *" placeholder="Rua, número, bairro, referência..." value={end} onChange={e=>setEnd(e.target.value)}/>
        <Input label="💰 Valor do pedido" hint="Deixe em branco → pagar na entrega" placeholder="Ex: 45,90" value={val} onChange={e=>setVal(e.target.value)}/>

        <Btn onClick={enviar} full>🛵 Enviar para Entregador</Btn>
      </Card>

      {/* pedidos aguardando */}
      {pendentes.length>0&&(
        <>
          <p style={{margin:"0 0 12px",fontWeight:600,fontSize:14,color:ORANGE}}>⏳ Aguardando entregador ({pendentes.length})</p>
          {pendentes.map(p=><PedidoCard key={p.id} p={p}/>)}
        </>
      )}

      {/* histórico */}
      {(emRota.length>0||entregues.length>0)&&(
        <>
          <p style={{margin:"18px 0 12px",fontWeight:500,fontSize:14,color:MUTED}}>Histórico</p>
          {[...emRota,...entregues].map(p=><PedidoCard key={p.id} p={p}/>)}
        </>
      )}

      {meusPedidos.length===0&&(
        <div style={{textAlign:"center",padding:"2rem",color:MUTED}}>
          <p style={{fontSize:28,margin:"0 0 8px"}}>📭</p>
          <p style={{fontSize:13,lineHeight:1.6}}>Nenhum pedido ainda.<br/>Quando um cliente entrar em contato, preencha os dados acima!</p>
        </div>
      )}
    </div>
  );
}

function PedidoCard({p}){
  const statusColor=p.status==="entregue"?GREEN:p.status==="em_rota"?BLUE:ORANGE;
  const statusText=p.status==="entregue"?"✅ Entregue":p.status==="em_rota"?"🛵 Em rota":"⏳ Aguardando";
  const valorLabel=p.pagarNaEntrega?"💵 Pagar na entrega":`R$ ${Number(p.valor).toFixed(2)}`;
  return(
    <Card style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{flex:1,minWidth:0}}>
          <p style={{margin:0,fontSize:13,fontWeight:600}}>📞 {p.telefoneCliente}</p>
          <p style={{margin:"5px 0 0",fontSize:13}}>📍 {p.endereco}</p>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <p style={{margin:"0 0 5px",fontWeight:700,color:p.pagarNaEntrega?MUTED:ORANGE,fontSize:13}}>{valorLabel}</p>
          <Badge color={statusColor} text={statusText}/>
          <p style={{margin:"5px 0 0",color:MUTED,fontSize:11}}>{p.hora}</p>
        </div>
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════
// 3. PAINEL DO ENTREGADOR
// ════════════════════════════════════════════════════════════════════
function PainelEntregador({pedidos,empresas}){
  const [carregando,setCarregando]=useState(true);
  const [cadastrado,setCadastrado]=useState(false);
  const [telCadastro,setTelCadastro]=useState("");
  const [empresasSel,setEmpresasSel]=useState([]);
  const [online,setOnline]=useState(true);
  const [emEntrega,setEmEntrega]=useState(null);
  const [editandoEmpresas,setEditandoEmpresas]=useState(false);
  const t=useToast();
  const prevLen=useRef(0);

  // carrega cadastro salvo (telefone lembrado neste navegador + dados confirmados no banco)
  useEffect(()=>{
    (async()=>{
      try{
        const telSalvo=localStorage.getItem("st_entregador_telefone");
        if(telSalvo){
          const perfil=await buscarEntregadorPorTelefone(telSalvo);
          if(perfil){
            setTelCadastro(perfil.telefone);
            setEmpresasSel(perfil.empresasIds);
            setCadastrado(true);
          }
        }
      }catch(_){
        // sem cadastro encontrado, segue para tela de cadastro
      }
      setCarregando(false);
    })();
  },[]);

  // restaura a entrega em andamento (caso a página seja recarregada no meio de uma corrida)
  useEffect(()=>{
    if(!cadastrado||carregando) return;
    const num=normalizaTel(telCadastro);
    const minhaEmRota=pedidos.find(p=>p.status==="em_rota"&&p.entregadorTel===num);
    if(minhaEmRota&&!emEntrega){
      setEmEntrega(minhaEmRota);
    }
  },[cadastrado,carregando,pedidos]);

  async function salvarPerfil(tel,emps){
    try{
      await salvarEntregador(tel,emps);
      localStorage.setItem("st_entregador_telefone",tel);
    }catch(_){
      t.show("⚠️ Erro ao salvar cadastro. Tente novamente.",RED);
    }
  }

  function toggleEmpresaSel(id){
    setEmpresasSel(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  }

  async function concluirCadastro(){
    const num=normalizaTel(telCadastro);
    if(!num){ t.show("⚠️ Digite seu número de telefone",RED); return; }
    if(empresasSel.length===0){ t.show("⚠️ Selecione ao menos 1 empresa para atender",RED); return; }
    await salvarPerfil(num,empresasSel);
    setTelCadastro(num);
    setCadastrado(true);
    setEditandoEmpresas(false);
    t.show("✅ Cadastro salvo! Você só verá corridas das empresas selecionadas.");
  }

  // só mostra corridas das empresas que esse entregador escolheu atender
  const disponiveisTodas=pedidos.filter(p=>p.status==="aguardando_entregador");
  const disponiveis=disponiveisTodas.filter(p=>empresasSel.includes(p.empresaId));
  const meuTel=normalizaTel(telCadastro);
  const entregues=pedidos.filter(p=>p.status==="entregue"&&p.entregadorTel===meuTel);

  useEffect(()=>{
    if(online&&disponiveis.length>prevLen.current){
      playPlim(1000);
      t.show("🔔 Nova corrida disponível!",ORANGE);
    }
    prevLen.current=disponiveis.length;
  },[disponiveis.length,online]);

  async function aceitar(p){
    const num=normalizaTel(telCadastro);
    try{
      await atualizarPedido(p.id,{status:"em_rota",entregadorTel:num});
      setEmEntrega({...p,status:"em_rota",entregadorTel:num});
      t.show("✅ Corrida aceita! Bora 🛵");
    }catch(_){
      t.show("⚠️ Erro ao aceitar corrida. Tente novamente.",RED);
    }
  }
  async function recusar(p){
    try{
      await atualizarPedido(p.id,{status:"recusado"});
      t.show("Corrida recusada",RED);
    }catch(_){
      t.show("⚠️ Erro ao recusar. Tente novamente.",RED);
    }
  }
  async function finalizar(){
    try{
      await atualizarPedido(emEntrega.id,{status:"entregue"});
      setEmEntrega(null);
      t.show("🏁 Entrega concluída! Bom trabalho 🎉");
    }catch(_){
      t.show("⚠️ Erro ao finalizar. Tente novamente.",RED);
    }
  }

  if(carregando){
    return <div style={{minHeight:"40vh"}}/>;
  }

  // ── tela: cadastro / edição de empresas atendidas ─────────────────
  if(!cadastrado||editandoEmpresas){
    return(
      <div className="st-screen" style={{maxWidth:460,margin:"0 auto",padding:"2rem 1.5rem"}}>
        <Toast msg={t.msg} color={t.color}/>
        <div style={{textAlign:"center",marginBottom:24}}>
          <span style={{fontSize:44}}>🛵</span>
          <h2 style={{margin:"12px 0 4px",fontSize:18}}>{cadastrado?"Editar empresas atendidas":"Cadastro de Entregador"}</h2>
          <p style={{color:MUTED,fontSize:13,margin:0}}>Receba notificações só das empresas que você atende</p>
        </div>

        <Card style={{marginBottom:16}}>
          <Input label="📞 Seu telefone" placeholder="(64) 99999-0000" value={telCadastro} onChange={e=>setTelCadastro(e.target.value)}/>
        </Card>

        <Card style={{marginBottom:20}}>
          <p style={{margin:"0 0 4px",fontWeight:600,fontSize:14}}>Quais empresas você vai entregar?</p>
          <p style={{margin:"0 0 14px",color:MUTED,fontSize:12,lineHeight:1.5}}>Selecione todas em que você faz entregas. Assim você só recebe corridas dos seus pontos.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {empresas.map(e=>{
              const sel=empresasSel.includes(e.id);
              return(
                <button key={e.id} onClick={()=>toggleEmpresaSel(e.id)} type="button" className="st-click-card"
                  style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,
                    border:`1px solid ${sel?ORANGE:BORDER}`,background:sel?ORANGE+"14":BG2,
                    cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:24,flexShrink:0}}>{e.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontWeight:600,fontSize:13}}>{e.nome}</p>
                    <p style={{margin:"1px 0 0",color:MUTED,fontSize:11}}>{e.cats.join(" · ")}</p>
                  </div>
                  <span style={{width:22,height:22,borderRadius:7,flexShrink:0,
                    border:`2px solid ${sel?ORANGE:BORDER}`,background:sel?ORANGE:"transparent",
                    display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700}}>
                    {sel?"✓":""}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Btn onClick={concluirCadastro} full size="lg">
          {cadastrado?"Salvar alterações":"Concluir cadastro 🛵"}
        </Btn>
        {cadastrado&&(
          <Btn onClick={()=>setEditandoEmpresas(false)} full variant="secondary" style={{marginTop:10}}>Cancelar</Btn>
        )}
      </div>
    );
  }

  return(
    <div className="st-screen" style={{maxWidth:440,margin:"0 auto",padding:"1.5rem"}}>
      <Toast msg={t.msg} color={t.color}/>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div>
          <h2 style={{margin:0,fontSize:18}}>Olá, Entregador! 🛵</h2>
          <p style={{margin:"2px 0 0",color:MUTED,fontSize:13}}>Start Delivery · Montividiu/GO</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div onClick={()=>setOnline(o=>!o)} className="st-switch"
            style={{width:46,height:26,borderRadius:99,background:online?`linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DEEP} 100%)`:"#6B728066",
              cursor:"pointer",position:"relative"}}>
            <div className="st-switch-knob" style={{position:"absolute",top:3,left:online?22:3,width:20,height:20,
              borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
          </div>
          <span style={{fontSize:11,color:online?ORANGE:MUTED,fontWeight:600}}>{online?"Online":"Offline"}</span>
        </div>
      </div>

      <button onClick={()=>setEditandoEmpresas(true)} type="button"
        style={{display:"flex",alignItems:"center",gap:8,width:"100%",background:BG2,border:`1px solid ${BORDER}`,
          borderRadius:10,padding:"8px 12px",marginBottom:18,cursor:"pointer",textAlign:"left"}}>
        <span style={{fontSize:14}}>🏪</span>
        <span style={{flex:1,fontSize:12,color:MUTED}}>
          Atendendo <strong style={{color:TEXT}}>{empresasSel.length}</strong> empresa{empresasSel.length!==1?"s":""}
        </span>
        <span style={{fontSize:11,color:ORANGE,fontWeight:600}}>Editar</span>
      </button>

      {/* stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}}>
        {[[disponiveis.length,"📦","Disponíveis",ORANGE],[emEntrega?1:0,"🛵","Em rota",BLUE],[entregues.length,"✅","Entregues",GREEN]].map(([v,i,l,c])=>(
          <div key={l} className="st-stat-box" style={{background:BG2,borderRadius:12,padding:"0.9rem",textAlign:"center",border:`1px solid ${c}22`}}>
            <p style={{margin:0,fontSize:20}}>{i}</p>
            <p style={{margin:"4px 0 2px",fontSize:22,fontWeight:700,color:c}}>{v}</p>
            <p style={{margin:0,color:MUTED,fontSize:11}}>{l}</p>
          </div>
        ))}
      </div>

      {/* em entrega */}
      {emEntrega&&(
        <Card style={{marginBottom:20,border:`1px solid ${BLUE}44`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <span style={{fontSize:24}}>🛵</span>
            <div>
              <p style={{margin:0,fontWeight:600,fontSize:14,color:BLUE}}>Em Entrega Agora</p>
              <p style={{margin:"1px 0 0",color:MUTED,fontSize:12}}>{emEntrega.empresaEmoji} {emEntrega.empresaNome}</p>
            </div>
          </div>
          <div style={{background:BG2,borderRadius:11,padding:"1rem",marginBottom:14}}>
            <p style={{margin:"0 0 4px",fontWeight:600,fontSize:13}}>📞 Cliente</p>
            <p style={{margin:"0 0 12px",fontSize:14}}>{emEntrega.telefoneCliente}</p>
            <p style={{margin:"0 0 4px",fontWeight:600,fontSize:13}}>📍 Endereço</p>
            <p style={{margin:0,fontSize:14}}>{emEntrega.endereco}</p>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{color:MUTED,fontSize:13}}>Valor</span>
            <span style={{fontWeight:700,fontSize:15,color:emEntrega.pagarNaEntrega?MUTED:ORANGE}}>
              {emEntrega.pagarNaEntrega?"💵 Pagar na entrega":`R$ ${Number(emEntrega.valor).toFixed(2)}`}
            </span>
          </div>
          <Btn variant="green" onClick={finalizar} full style={{fontSize:15}}>✅ Marcar como Entregue</Btn>
        </Card>
      )}

      {/* corridas */}
      {!online?(
        <Card><p style={{textAlign:"center",color:MUTED,fontSize:13,padding:"1.5rem"}}>Você está offline.<br/>Ative para receber corridas.</p></Card>
      ):disponiveis.length===0&&!emEntrega?(
        <Card style={{textAlign:"center",padding:"2rem"}}>
          <p style={{fontSize:28,margin:"0 0 8px"}}>📭</p>
          <p style={{color:MUTED,fontSize:13}}>Nenhuma corrida das suas empresas no momento.<br/><span style={{fontSize:11}}>Aguarde um pedido chegar!</span></p>
        </Card>
      ):disponiveis.length>0&&(
        <>
          <p style={{margin:"0 0 12px",fontWeight:600,fontSize:14,color:ORANGE}}>📦 Corridas disponíveis ({disponiveis.length})</p>
          {disponiveis.map(p=>(
            <Card key={p.id} style={{marginBottom:12,border:`1px solid ${ORANGE}44`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <p style={{margin:0,fontWeight:600,fontSize:14}}>{p.empresaEmoji} {p.empresaNome}</p>
                  <p style={{margin:"2px 0 0",color:MUTED,fontSize:12}}>Pedido às {p.hora}</p>
                </div>
                <p style={{margin:0,fontWeight:700,color:p.pagarNaEntrega?MUTED:ORANGE,fontSize:14}}>
                  {p.pagarNaEntrega?"💵 Pagar na entrega":`R$ ${Number(p.valor).toFixed(2)}`}
                </p>
              </div>
              <div style={{background:BG2,borderRadius:9,padding:"10px 12px",marginBottom:12}}>
                <p style={{margin:"0 0 5px",fontSize:13}}>📞 <strong>{p.telefoneCliente}</strong></p>
                <p style={{margin:0,fontSize:13}}>📍 {p.endereco}</p>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn size="sm" variant="secondary" onClick={()=>recusar(p)}>Recusar</Btn>
                <Btn size="sm" onClick={()=>aceitar(p)} disabled={!!emEntrega} style={{flex:1}}>
                  {emEntrega?"Já em entrega":"Aceitar Corrida 🛵"}
                </Btn>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* histórico */}
      {entregues.length>0&&(
        <div style={{marginTop:20}}>
          <p style={{margin:"0 0 12px",fontWeight:500,fontSize:14,color:MUTED}}>Histórico de hoje</p>
          {entregues.map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"10px 0",borderBottom:`1px solid ${BORDER}`,fontSize:12,gap:8,flexWrap:"wrap"}}>
              <span>{p.empresaEmoji} {p.empresaNome}</span>
              <span style={{color:MUTED}}>{p.telefoneCliente}</span>
              <span style={{fontWeight:600,color:GREEN}}>{p.pagarNaEntrega?"Pago na entrega":`R$ ${Number(p.valor).toFixed(2)}`}</span>
              <Badge color={GREEN} text="✅"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 4. PAINEL ADMIN
// ════════════════════════════════════════════════════════════════════
function PainelAdmin({pedidos,empresas}){
  const [logado,setLogado]=useState(false);
  const [senha,setSenha]=useState("");
  const [aba,setAba]=useState("dashboard");
  const [nova,setNova]=useState({nome:"",cats:["Restaurante"],emoji:"🏪",whatsapp:"",telefone:"",instagram:"",avaliacao:"5.0",tempoMin:"20",tempoMax:"40"});
  const t=useToast();

  function login(){if(senha==="start2024")setLogado(true);else{t.show("Senha incorreta",RED);}}
  function toggleNovaCat(c){
    setNova(n=>({...n,cats:n.cats.includes(c)?n.cats.filter(x=>x!==c):[...n.cats,c]}));
  }
  async function addEmpresa(){
    if(!nova.nome.trim()||!nova.whatsapp.trim()){t.show("Preencha nome e WhatsApp",RED);return;}
    if(nova.cats.length===0){t.show("Selecione pelo menos 1 classificação",RED);return;}
    try{
      await criarEmpresa({
        ...nova,
        aberto:true,
        avaliacao:parseFloat(nova.avaliacao)||5,
        tempoMin:parseInt(nova.tempoMin)||20,
        tempoMax:parseInt(nova.tempoMax)||40,
      });
      setNova({nome:"",cats:["Restaurante"],emoji:"🏪",whatsapp:"",telefone:"",instagram:"",avaliacao:"5.0",tempoMin:"20",tempoMax:"40"});
      t.show("✅ Empresa cadastrada!");
    }catch(_){
      t.show("⚠️ Erro ao cadastrar. Tente novamente.",RED);
    }
  }
  async function toggleAberto(id,abertoAtual){
    try{
      await atualizarEmpresa(id,{aberto:!abertoAtual});
    }catch(_){
      t.show("⚠️ Erro ao atualizar. Tente novamente.",RED);
    }
  }
  async function remover(id,nome){
    if(window.confirm(`Tem certeza que deseja excluir "${nome}"?\n\nEssa ação não pode ser desfeita.`)){
      try{
        await excluirEmpresa(id);
        t.show(`🗑️ "${nome}" foi excluída.`,RED);
      }catch(_){
        t.show("⚠️ Erro ao excluir. Tente novamente.",RED);
      }
    }
  }

  if(!logado) return(
    <div className="st-screen" style={{maxWidth:360,margin:"4rem auto",padding:"0 1.5rem"}}>
      <Toast msg={t.msg} color={t.color}/>
      <div style={{textAlign:"center",marginBottom:28}}>
        <span style={{fontSize:40}}>🔐</span>
        <h2 style={{margin:"12px 0 4px",fontSize:18}}>Área Administrativa</h2>
        <p style={{color:MUTED,fontSize:13,margin:0}}>Acesso restrito · Start Delivery</p>
      </div>
      <Card>
        <input type="password" placeholder="Senha de acesso" value={senha} className="st-input"
          onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}
          style={{width:"100%",padding:"11px 12px",borderRadius:9,border:`1px solid ${BORDER}`,
            background:BG2,color:TEXT,fontSize:14,boxSizing:"border-box",marginBottom:12}}/>
        <Btn onClick={login} full>Entrar</Btn>
        <p style={{textAlign:"center",color:MUTED,fontSize:11,margin:"10px 0 0"}}>Senha: start2024</p>
      </Card>
    </div>
  );

  const abas=[["dashboard","📊 Dashboard"],["empresas","🏪 Empresas"],["pedidos","📦 Pedidos"]];

  return(
    <div className="st-screen" style={{display:"flex",minHeight:"70vh"}}>
      <div style={{width:185,background:BG2,borderRight:`1px solid ${BORDER}`,padding:"1.5rem 0",flexShrink:0}}>
        <Toast msg={t.msg} color={t.color}/>
        <div style={{padding:"0 1rem 1.25rem",borderBottom:`1px solid ${BORDER}`,marginBottom:6}}>
          <p style={{margin:0,fontWeight:700,fontSize:14,color:ORANGE}}>Start Delivery</p>
          <p style={{margin:"2px 0 0",color:MUTED,fontSize:11}}>Administração</p>
        </div>
        {abas.map(([id,l])=>(
          <button key={id} onClick={()=>setAba(id)} className="st-admin-tab"
            style={{display:"block",width:"100%",textAlign:"left",padding:"10px 1rem",
              background:aba===id?ORANGE+"22":"transparent",color:aba===id?ORANGE:TEXT,
              border:"none",borderRight:aba===id?`2px solid ${ORANGE}`:"2px solid transparent",
              cursor:"pointer",fontSize:13,fontWeight:aba===id?600:400}}>
            {l}
          </button>
        ))}
        <div style={{padding:"1.5rem 1rem 0"}}>
          <button onClick={()=>setLogado(false)} style={{background:"none",border:"none",color:MUTED,fontSize:12,cursor:"pointer"}}>← Sair</button>
        </div>
      </div>

      <div className="st-fade-in" style={{flex:1,padding:"1.5rem",overflow:"auto"}} key={aba}>
        {aba==="dashboard"&&(
          <>
            <h2 style={{margin:"0 0 20px",fontSize:18}}>Dashboard</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:28}}>
              {[[pedidos.length,"📦",ORANGE,"Total pedidos"],[empresas.filter(e=>e.aberto).length,"🏪",GREEN,"Empresas ativas"],[pedidos.filter(p=>p.status==="em_rota").length,"🛵",BLUE,"Em rota"],[pedidos.filter(p=>p.status==="entregue").length,"✅",GREEN,"Entregues"]].map(([v,i,c,l])=>(
                <div key={l} className="st-stat-box" style={{background:BG2,borderRadius:12,padding:"1rem",textAlign:"center",border:`1px solid ${c}22`}}>
                  <p style={{margin:0,fontSize:22}}>{i}</p>
                  <p style={{margin:"6px 0 4px",fontSize:26,fontWeight:700,color:c}}>{v}</p>
                  <p style={{margin:0,color:MUTED,fontSize:11}}>{l}</p>
                </div>
              ))}
            </div>
            <h3 style={{margin:"0 0 14px",fontSize:14}}>Pedidos recentes</h3>
            {pedidos.length===0?<p style={{color:MUTED,fontSize:13}}>Nenhum pedido ainda.</p>:pedidos.slice(0,8).map((p,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 0",borderBottom:`1px solid ${BORDER}`,fontSize:12,gap:8,flexWrap:"wrap"}}>
                <span style={{color:MUTED}}>#{i+1}</span>
                <span style={{fontWeight:600}}>{p.empresaEmoji} {p.empresaNome}</span>
                <span style={{color:MUTED}}>📞 {p.telefoneCliente}</span>
                <span style={{color:MUTED}}>{p.hora}</span>
                <Badge color={p.status==="entregue"?GREEN:p.status==="em_rota"?BLUE:ORANGE}
                  text={p.status==="entregue"?"Entregue":p.status==="em_rota"?"Em rota":"Aguardando"}/>
                <span style={{fontWeight:600}}>{p.pagarNaEntrega?"Pagar na entrega":`R$ ${Number(p.valor).toFixed(2)}`}</span>
              </div>
            ))}
          </>
        )}

        {aba==="empresas"&&(
          <>
            <h2 style={{margin:"0 0 20px",fontSize:18}}>Empresas Parceiras</h2>
            <Card style={{marginBottom:20}}>
              <p style={{fontWeight:600,margin:"0 0 14px",fontSize:14}}>Cadastrar nova empresa</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                {[["Nome *","nome","text"],["Emoji","emoji","text"],["WhatsApp * (5564...)","whatsapp","text"],["Telefone","telefone","text"],["Instagram (sem @)","instagram","text"]].map(([ph,k])=>(
                  <input key={k} placeholder={ph} value={nova[k]} onChange={e=>setNova(n=>({...n,[k]:e.target.value}))} className="st-input"
                    style={{padding:"9px 12px",borderRadius:9,border:`1px solid ${BORDER}`,background:BG2,color:TEXT,fontSize:13}}/>
                ))}
              </div>
              <div style={{marginBottom:14}}>
                <p style={{margin:"0 0 8px",fontSize:12,fontWeight:600,color:TEXT}}>Classificações (selecione uma ou mais)</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {CATS.filter(c=>c!=="Todos").map(c=>{
                    const sel=nova.cats.includes(c);
                    return(
                      <button key={c} onClick={()=>toggleNovaCat(c)} type="button" className="st-cat-pill"
                        style={{padding:"6px 13px",borderRadius:99,fontSize:12,cursor:"pointer",
                          border:`1px solid ${sel?ORANGE:BORDER}`,
                          background:sel?`linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DEEP} 100%)`:BG2,
                          color:sel?"#fff":TEXT,fontWeight:sel?600:400}}>
                        {sel?"✓ ":""}{c}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
                <input placeholder="Avaliação (ex: 4.8)" value={nova.avaliacao} onChange={e=>setNova(n=>({...n,avaliacao:e.target.value}))} className="st-input"
                  style={{padding:"9px 12px",borderRadius:9,border:`1px solid ${BORDER}`,background:BG2,color:TEXT,fontSize:13}}/>
                <input placeholder="Min min" value={nova.tempoMin} onChange={e=>setNova(n=>({...n,tempoMin:e.target.value}))} className="st-input"
                  style={{padding:"9px 10px",borderRadius:9,border:`1px solid ${BORDER}`,background:BG2,color:TEXT,fontSize:13}}/>
                <input placeholder="Max min" value={nova.tempoMax} onChange={e=>setNova(n=>({...n,tempoMax:e.target.value}))} className="st-input"
                  style={{padding:"9px 10px",borderRadius:9,border:`1px solid ${BORDER}`,background:BG2,color:TEXT,fontSize:13}}/>
              </div>
              <Btn onClick={addEmpresa}>+ Cadastrar</Btn>
            </Card>
            {empresas.map(e=>(
              <Card key={e.id} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontSize:28}}>{e.emoji}</span>
                    <div>
                      <p style={{margin:0,fontWeight:600,fontSize:14}}>{e.nome}</p>
                      <p style={{margin:"2px 0 0",color:MUTED,fontSize:12}}>{e.cats.join(" · ")} · {e.whatsapp}</p>
                      <div style={{display:"flex",gap:10,marginTop:3,alignItems:"center"}}>
                        {e.avaliacao!=null&&<StarRating val={e.avaliacao}/>}
                        {e.tempoMin!=null&&<span style={{fontSize:11,color:MUTED}}>🕐 {e.tempoMin}–{e.tempoMax} min</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                    <Badge color={e.aberto?GREEN:RED} text={e.aberto?"Ativo":"Inativo"}/>
                    <Btn size="sm" variant="secondary" onClick={()=>toggleAberto(e.id,e.aberto)}>{e.aberto?"Desativar":"Ativar"}</Btn>
                    <Btn size="sm" variant="danger" onClick={()=>remover(e.id,e.nome)}>🗑️ Excluir</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {aba==="pedidos"&&(
          <>
            <h2 style={{margin:"0 0 8px",fontSize:18}}>Todos os Pedidos</h2>
            <p style={{color:MUTED,fontSize:13,margin:"0 0 20px"}}>Visão geral de todos os pedidos da plataforma.</p>
            {pedidos.length===0
              ?<Card><p style={{textAlign:"center",color:MUTED,padding:"1.5rem",fontSize:13}}>Nenhum pedido ainda.</p></Card>
              :pedidos.map((p,i)=>(
                <Card key={i} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <div>
                      <p style={{margin:"0 0 2px",fontWeight:600,fontSize:14}}>{p.empresaEmoji} {p.empresaNome}</p>
                      <p style={{margin:"0 0 2px",fontSize:13}}>📞 {p.telefoneCliente}</p>
                      <p style={{margin:"0 0 2px",color:MUTED,fontSize:12}}>📍 {p.endereco}</p>
                      <p style={{margin:"4px 0 0",color:MUTED,fontSize:11}}>{p.data} às {p.hora}</p>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <p style={{margin:"0 0 6px",fontWeight:700,color:p.pagarNaEntrega?MUTED:ORANGE,fontSize:13}}>
                        {p.pagarNaEntrega?"💵 Pagar na entrega":`R$ ${Number(p.valor).toFixed(2)}`}
                      </p>
                      <Badge color={p.status==="entregue"?GREEN:p.status==="em_rota"?BLUE:ORANGE}
                        text={p.status==="entregue"?"✅ Entregue":p.status==="em_rota"?"🛵 Em rota":"⏳ Aguardando"}/>
                    </div>
                  </div>
                </Card>
              ))
            }
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 5. QR CODE
// ════════════════════════════════════════════════════════════════════
function QRCodeView(){
  const [local,setLocal]=useState("Posto Central");
  const locais=["Posto Central","Hotel Montividiu","Restaurante do Zé","Evento da Praça","Supermercado Família","Entrada da cidade"];
  const cells=[[1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,1,1,0,1,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],[1,0,1,1,0,1,1,1,0,0,1,1,1,0,1,0,1,1,0],[0,1,1,0,1,0,0,0,1,1,0,1,0,1,1,0,0,1,1],[1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,1,0,1],[0,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0],[1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,0],[1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,1,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,1,0,1],[1,0,0,0,0,0,1,0,0,1,1,0,0,1,1,0,0,1,0],[1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,0,1,1,1]];
  const S=9;
  return(
    <div className="st-screen" style={{maxWidth:480,margin:"0 auto",padding:"1.75rem 1.5rem"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <h2 style={{margin:"0 0 6px",fontSize:18}}>QR Code de Divulgação</h2>
        <p style={{color:MUTED,fontSize:13,margin:0}}>Gere e imprima para instalar em estabelecimentos parceiros</p>
      </div>
      <Card style={{marginBottom:16}}>
        <p style={{fontWeight:500,margin:"0 0 10px",fontSize:13}}>Local de instalação:</p>
        <select value={local} onChange={e=>setLocal(e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1px solid ${BORDER}`,background:BG2,color:TEXT,fontSize:14}}>
          {locais.map(l=><option key={l}>{l}</option>)}
        </select>
      </Card>
      <Card style={{textAlign:"center"}}>
        <div style={{display:"inline-block",background:"#fff",borderRadius:14,padding:16,marginBottom:16}}>
          <svg width={S*19} height={S*19} viewBox={`0 0 ${S*19} ${S*19}`}>
            {cells.map((row,r)=>row.map((cell,c)=>cell?<rect key={`${r}-${c}`} x={c*S} y={r*S} width={S-1} height={S-1} rx={1.5} fill={ORANGE}/>:null))}
          </svg>
        </div>
        <p style={{margin:"0 0 4px",fontWeight:600,fontSize:15}}>Start Delivery</p>
        <p style={{margin:"0 0 6px",color:MUTED,fontSize:13}}>📍 {local}</p>
        <p style={{margin:"0 0 20px",color:MUTED,fontSize:12}}>Escaneie e faça seu pedido!</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn variant="secondary" size="sm">🖨️ Imprimir</Btn>
          <Btn size="sm">📤 Compartilhar</Btn>
        </div>
      </Card>
      <div style={{marginTop:20,background:ORANGE+"12",borderRadius:11,padding:"1rem 1.25rem"}}>
        <p style={{margin:"0 0 8px",fontWeight:500,fontSize:13}}>💡 Sugestão de locais:</p>
        <p style={{margin:0,color:MUTED,fontSize:12,lineHeight:1.7}}>Postos · Hotéis · Restaurantes · Comércios parceiros · Eventos · Entrada da cidade</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// APP
// ════════════════════════════════════════════════════════════════════
export default function App(){
  const [tela,setTela]=useState("cliente");
  const [empresas,setEmpresas]=useState([]);
  const [pedidos,setPedidos]=useState([]);
  const [carregandoApp,setCarregandoApp]=useState(true);

  async function recarregarPedidos(){
    try{
      const lista=await buscarPedidos();
      setPedidos(lista);
    }catch(_){
      // erro de rede momentâneo, vai tentar de novo na próxima atualização em tempo real
    }
  }

  async function recarregarEmpresas(){
    try{
      const lista=await buscarEmpresas();
      setEmpresas(lista);
    }catch(_){
      // erro de rede momentâneo
    }
  }

  // carregamento inicial + escuta de mudanças em tempo real (Supabase Realtime)
  useEffect(()=>{
    (async()=>{
      await Promise.all([recarregarEmpresas(),recarregarPedidos()]);
      setCarregandoApp(false);
    })();
    const pararPedidos=escutarPedidos(recarregarPedidos);
    const pararEmpresas=escutarEmpresas(recarregarEmpresas);
    return ()=>{ pararPedidos(); pararEmpresas(); };
  },[]);

  const corridasDisp=pedidos.filter(p=>p.status==="aguardando_entregador").length;

  const abas=[["cliente","🛍️","Pedir"],["empresa","🏪","Empresa"],["entregador","🛵","Entregador"],["admin","🔐","Admin"]];
  const idx=abas.findIndex(a=>a[0]===tela);

  if(carregandoApp){
    return(
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,-apple-system,sans-serif"}}>
        <p style={{color:MUTED,fontSize:14}}>Carregando Start Delivery...</p>
      </div>
    );
  }

  return(
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",color:TEXT,minHeight:"100vh"}}>
      <style>{`
        *{box-sizing:border-box}
        input::placeholder{color:var(--color-text-tertiary,#999)!important}
        button:focus-visible{outline:2px solid ${ORANGE};outline-offset:2px}

        @keyframes stFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes stScreenIn{from{opacity:0;transform:translateY(10px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes stToastIn{from{opacity:0;transform:translate(-50%,-12px)}to{opacity:1;transform:translate(-50%,0)}}
        @keyframes stPop{0%{transform:scale(1)}50%{transform:scale(1.18) rotate(-4deg)}100%{transform:scale(1)}}

        .st-screen{animation:stScreenIn .38s cubic-bezier(.22,1,.36,1) both}
        .st-fade-in{animation:stFadeIn .32s cubic-bezier(.22,1,.36,1) both}
        .st-toast{animation:stToastIn .28s cubic-bezier(.22,1,.36,1) both}

        .st-btn{transition:transform .15s ease, box-shadow .15s ease, opacity .15s ease, filter .15s ease}
        .st-btn:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.06)}
        .st-btn:active:not(:disabled){transform:translateY(0) scale(.97)}

        .st-click-card{transition:transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s ease, border-color .22s ease}
        .st-click-card:hover{transform:translateY(-3px) scale(1.012);box-shadow:0 10px 28px rgba(255,107,26,0.16);border-color:${ORANGE}77}
        .st-click-card:active{transform:translateY(-1px) scale(.995)}
        .st-click-card:hover .st-chevron{transform:translateX(4px)}
        .st-click-card:hover .st-emoji-box{transform:scale(1.08) rotate(-3deg)}
        .st-chevron{display:inline-block;transition:transform .22s cubic-bezier(.22,1,.36,1)}
        .st-emoji-box{transition:transform .22s cubic-bezier(.22,1,.36,1)}
        .st-click-card:hover .st-emoji-pop{animation:stPop .4s ease}

        .st-contact-btn{transition:transform .18s ease, box-shadow .18s ease, filter .18s ease}
        .st-contact-btn:hover{transform:translateY(-2px);filter:brightness(1.03)}
        .st-contact-btn:active{transform:translateY(0) scale(.98)}

        .st-cat-pill{transition:transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease}
        .st-cat-pill:hover{transform:translateY(-2px)}
        .st-cat-scroll{scrollbar-width:none}
        .st-cat-scroll::-webkit-scrollbar{display:none}

        .st-stat-box{transition:transform .2s ease}
        .st-stat-box:hover{transform:translateY(-2px)}

        .st-back-btn{transition:background .15s ease, transform .15s ease}
        .st-back-btn:hover{background:rgba(255,255,255,0.28)!important;transform:translateX(-2px)}

        .st-input{transition:border-color .18s ease, box-shadow .18s ease}
        .st-input:focus{border-color:${ORANGE}!important;box-shadow:0 0 0 3px ${ORANGE}22}

        .st-switch{transition:background .25s ease}
        .st-switch-knob{transition:left .25s cubic-bezier(.22,1,.36,1)}

        .st-admin-tab{transition:background .18s ease, color .18s ease, padding-left .18s ease}
        .st-admin-tab:hover{padding-left:1.15rem}

        @media (prefers-reduced-motion: reduce){
          .st-screen,.st-fade-in,.st-toast,.st-btn,.st-click-card,.st-contact-btn,.st-cat-pill,.st-stat-box,.st-back-btn,.st-input,.st-switch,.st-switch-knob,.st-admin-tab,.st-emoji-box,.st-chevron{animation:none!important;transition:none!important}
        }
      `}</style>

      <div className="st-nav" style={{
          borderBottom:`1px solid ${BORDER}`,
          background:`linear-gradient(180deg, ${BG} 0%, ${BG2}66 100%)`,
          backdropFilter:"blur(8px)",
          position:"sticky",top:0,zIndex:100,
          boxShadow:"0 1px 0 rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)"
        }}>
        <div style={{display:"flex",alignItems:"center",padding:"0 0.85rem",overflowX:"auto",position:"relative"}} className="st-cat-scroll">
          <img src={LOGO_START} alt="Start Delivery" style={{height:30,marginRight:14,flexShrink:0,filter:"invert(50%) sepia(1) saturate(5) hue-rotate(10deg)"}}/>
          <div style={{display:"flex",gap:4,position:"relative"}}>
            {abas.map(([id,icon,label])=>(
              <button key={id} onClick={()=>setTela(id)}
                style={{position:"relative",display:"flex",alignItems:"center",gap:7,
                  padding:"11px 16px",background:"transparent",border:"none",
                  borderRadius:11,cursor:"pointer",fontSize:13,
                  color:tela===id?"#fff":MUTED,
                  fontWeight:tela===id?600:500,
                  flexShrink:0,whiteSpace:"nowrap",
                  zIndex:2,
                  transition:"color .25s ease"}}>
                {tela===id&&(
                  <span style={{
                    position:"absolute",inset:0,borderRadius:11,
                    background:`linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DEEP} 100%)`,
                    boxShadow:`0 4px 14px ${ORANGE}55`,
                    zIndex:-1,
                    animation:"stNavPill .3s cubic-bezier(.22,1,.36,1) both"
                  }}/>
                )}
                <span style={{fontSize:15}}>{icon}</span>
                <span>{label}</span>
                {id==="entregador"&&corridasDisp>0&&(
                  <span style={{position:"absolute",top:2,right:2,background:RED,color:"#fff",
                    fontSize:9,fontWeight:700,borderRadius:99,padding:"1px 5px",
                    boxShadow:"0 2px 6px rgba(0,0,0,0.25)",
                    animation:"stBadgePulse 1.8s ease-in-out infinite"}}>{corridasDisp}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes stNavPill{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
          @keyframes stBadgePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
        `}</style>
      </div>

      <div style={{minHeight:"70vh"}} key={tela}>
        {tela==="cliente"    &&<PortalCliente    empresas={empresas}/>}
        {tela==="empresa"    &&<PainelEmpresa    pedidos={pedidos} empresas={empresas}/>}
        {tela==="entregador" &&<PainelEntregador pedidos={pedidos} empresas={empresas}/>}
        {tela==="admin"      &&<PainelAdmin      pedidos={pedidos} empresas={empresas}/>}
      </div>
    </div>
  );
}
