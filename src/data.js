import { supabase } from './supabaseClient';

// ════════════════════════════════════════════════════════════════════
// Conversão entre o formato do banco (snake_case) e o formato do app (camelCase)
// ════════════════════════════════════════════════════════════════════

function empresaDoBanco(row) {
  return {
    id: row.id,
    nome: row.nome,
    cats: row.cats || [],
    emoji: row.emoji || "🏪",
    whatsapp: row.whatsapp,
    telefone: row.telefone,
    instagram: row.instagram,
    aberto: row.aberto,
    avaliacao: row.avaliacao,
    tempoMin: row.tempo_min,
    tempoMax: row.tempo_max,
    obs: row.obs,
  };
}

function empresaParaBanco(e) {
  return {
    nome: e.nome,
    cats: e.cats,
    emoji: e.emoji,
    whatsapp: e.whatsapp,
    telefone: e.telefone,
    instagram: e.instagram || null,
    aberto: e.aberto,
    avaliacao: e.avaliacao,
    tempo_min: e.tempoMin,
    tempo_max: e.tempoMax,
    obs: e.obs || null,
  };
}

function pedidoDoBanco(row) {
  return {
    id: row.id,
    empresaId: row.empresa_id,
    empresaNome: row.empresa_nome,
    empresaEmoji: row.empresa_emoji,
    telefoneCliente: row.telefone_cliente,
    endereco: row.endereco,
    valor: row.valor,
    pagarNaEntrega: row.pagar_na_entrega,
    status: row.status,
    entregadorTel: row.entregador_tel,
    hora: row.hora,
    data: row.data,
  };
}

function pedidoParaBanco(p) {
  return {
    empresa_id: p.empresaId,
    empresa_nome: p.empresaNome,
    empresa_emoji: p.empresaEmoji,
    telefone_cliente: p.telefoneCliente,
    endereco: p.endereco,
    valor: p.valor,
    pagar_na_entrega: p.pagarNaEntrega,
    status: p.status,
    entregador_tel: p.entregadorTel || null,
    hora: p.hora,
    data: p.data,
  };
}

// ════════════════════════════════════════════════════════════════════
// EMPRESAS
// ════════════════════════════════════════════════════════════════════

export async function buscarEmpresas() {
  const { data, error } = await supabase.from('empresas').select('*').order('id');
  if (error) throw error;
  return data.map(empresaDoBanco);
}

export async function criarEmpresa(empresa) {
  const { data, error } = await supabase
    .from('empresas')
    .insert(empresaParaBanco(empresa))
    .select()
    .single();
  if (error) throw error;
  return empresaDoBanco(data);
}

export async function atualizarEmpresa(id, campos) {
  const camposBanco = {};
  if ('aberto' in campos) camposBanco.aberto = campos.aberto;
  if ('nome' in campos) camposBanco.nome = campos.nome;
  if ('cats' in campos) camposBanco.cats = campos.cats;
  const { error } = await supabase.from('empresas').update(camposBanco).eq('id', id);
  if (error) throw error;
}

export async function excluirEmpresa(id) {
  const { error } = await supabase.from('empresas').delete().eq('id', id);
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════════════
// PEDIDOS
// ════════════════════════════════════════════════════════════════════

export async function buscarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(pedidoDoBanco);
}

export async function criarPedido(pedido) {
  const { data, error } = await supabase
    .from('pedidos')
    .insert(pedidoParaBanco(pedido))
    .select()
    .single();
  if (error) throw error;
  return pedidoDoBanco(data);
}

export async function atualizarPedido(id, campos) {
  const camposBanco = {};
  if ('status' in campos) camposBanco.status = campos.status;
  if ('entregadorTel' in campos) camposBanco.entregador_tel = campos.entregadorTel;
  const { error } = await supabase.from('pedidos').update(camposBanco).eq('id', id);
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════════════
// ENTREGADORES
// ════════════════════════════════════════════════════════════════════

function entregadorDoBanco(row) {
  return {
    telefone: row.telefone,
    nome: row.nome || "",
    empresasIds: row.empresas_ids || [],
    status: row.status || "pendente",
  };
}

export async function buscarEntregadorPorTelefone(telefone) {
  const { data, error } = await supabase
    .from('entregadores')
    .select('*')
    .eq('telefone', telefone)
    .maybeSingle();
  if (error) throw error;
  return data ? entregadorDoBanco(data) : null;
}

// Cadastro novo de entregador: sempre entra como "pendente", aguardando aprovação do admin
export async function salvarEntregador(telefone, nome, empresasIds) {
  const { error } = await supabase
    .from('entregadores')
    .upsert({ telefone, nome, empresas_ids: empresasIds, status: 'pendente' }, { onConflict: 'telefone' });
  if (error) throw error;
}

export async function buscarTodosEntregadores() {
  const { data, error } = await supabase
    .from('entregadores')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(entregadorDoBanco);
}

export async function atualizarStatusEntregador(telefone, status) {
  const { error } = await supabase
    .from('entregadores')
    .update({ status })
    .eq('telefone', telefone);
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════════════
// TEMPO REAL — escuta mudanças nos pedidos e chama o callback automaticamente
// ════════════════════════════════════════════════════════════════════

export function escutarPedidos(callback) {
  const canal = supabase
    .channel('pedidos-mudancas')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => {
      callback();
    })
    .subscribe();
  return () => supabase.removeChannel(canal);
}

export function escutarEmpresas(callback) {
  const canal = supabase
    .channel('empresas-mudancas')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'empresas' }, () => {
      callback();
    })
    .subscribe();
  return () => supabase.removeChannel(canal);
}

export function escutarEntregadores(callback) {
  const canal = supabase
    .channel('entregadores-mudancas')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'entregadores' }, () => {
      callback();
    })
    .subscribe();
  return () => supabase.removeChannel(canal);
}
