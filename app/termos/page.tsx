export default function TermosPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Termos de Serviço</h1>

      <p>
        Ao enviar seu e-mail neste formulário, você concorda que ele poderá ser
        utilizado exclusivamente para validação da sua conta Google Play e para
        liberação do acesso ao aplicativo <strong>&quot;Onde Tem Evento Rio&quot;</strong>.
      </p>

      <p>
        Seu e-mail não será compartilhado com terceiros, não será utilizado para
        marketing e não será armazenado por período superior ao necessário para
        a liberação e controle de acesso ao aplicativo.
      </p>

      <p>
        Você poderá solicitar a remoção do seu e-mail do nosso sistema a qualquer
        momento, bem como tirar dúvidas sobre estes Termos, entrando em contato
        pelo e-mail{" "}
        <a
          href="mailto:contato.ondetemevento@gmail.com"
          className="text-emerald-600 underline"
        >
          contato.ondetemevento@gmail.com
        </a>.
      </p>
    </main>
  )
}
