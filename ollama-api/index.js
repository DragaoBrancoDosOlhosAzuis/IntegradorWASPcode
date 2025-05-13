import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// Configurações básicas de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:5500"
}));
app.use(express.json());

// Dados locais da biblioteca
const acervoBiblioteca = {
    disponiveis: [
        { id: 1, titulo: "O Homem de Giz", autor: "C.J. Tudor", categoria: "Suspense" },
        { id: 2, titulo: "Diário de Um Banana 3", autor: "Jeff Kinney", categoria: "Infantil" },
        { id: 3, titulo: "Dom Casmurro", autor: "Machado de Assis", categoria: "Clássico" },
        { id: 4, titulo: "Boa Noite PunPun", autor: "Inio Asano", categoria: "Mangá" },
        { id: 5, titulo: "Dorohedoro", autor: "Q Hayashida", categoria: "Mangá" }
    ],
    indisponiveis: [
        { id: 6, titulo: "Diário de Um Banana 5", autor: "Jeff Kinney", categoria: "Infantil" },
        { id: 7, titulo: "A Cartomante", autor: "Machado de Assis", categoria: "Clássico" }
    ]
};

// Rota de status simplificada
app.get("/api/status", (req, res) => {
    res.status(200).json({
        status: "operacional",
        version: "1.0.0",
        acervo: {
            total: acervoBiblioteca.disponiveis.length + acervoBiblioteca.indisponiveis.length,
            disponiveis: acervoBiblioteca.disponiveis.length
        }
    });
});

// Rota para listar livros
app.get("/api/livros", (req, res) => {
    try {
        const { disponivel } = req.query;
        
        let livros = [...acervoBiblioteca.disponiveis];
        if (disponivel === "false") {
            livros = [...acervoBiblioteca.indisponiveis];
        } else if (!disponivel) {
            livros = [...acervoBiblioteca.disponiveis, ...acervoBiblioteca.indisponiveis];
        }

        res.status(200).json(livros);
    } catch (error) {
        res.status(500).json({ error: "Erro ao processar a requisição" });
    }
});

// Rota para buscar livro por termo
app.get("/api/livros/buscar", (req, res) => {
    try {
        const { termo } = req.query;
        
        if (!termo) {
            return res.status(400).json({ error: "Parâmetro 'termo' é obrigatório" });
        }

        const todosLivros = [...acervoBiblioteca.disponiveis, ...acervoBiblioteca.indisponiveis];
        const resultados = todosLivros.filter(livro => 
            livro.titulo.toLowerCase().includes(termo.toLowerCase()) ||
            livro.autor.toLowerCase().includes(termo.toLowerCase())
        );

        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).json({ error: "Erro ao processar a busca" });
    }
});

// Rota para verificar disponibilidade
app.get("/api/livros/disponibilidade/:id", (req, res) => {
    try {
        const { id } = req.params;
        const livroDisponivel = acervoBiblioteca.disponiveis.find(l => l.id == id);
        const livroIndisponivel = acervoBiblioteca.indisponiveis.find(l => l.id == id);

        if (!livroDisponivel && !livroIndisponivel) {
            return res.status(404).json({ error: "Livro não encontrado" });
        }

        res.status(200).json({
            disponivel: !!livroDisponivel,
            livro: livroDisponivel || livroIndisponivel
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao verificar disponibilidade" });
    }
});

// Rota simulada do chatbot (para manter compatibilidade)
app.post("/api/ia", (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: "Texto não fornecido" });
        }

        // Resposta simulada baseada no acervo
        const respostaSimulada = {
            response: `Recebemos sua mensagem: "${text}". Este é um chatbot local. Consulte /api/livros para dados do acervo.`,
            metadata: {
                model: "local",
                timestamp: new Date().toISOString()
            }
        };

        res.status(200).json(respostaSimulada);
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor" });
    }
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint não encontrado" });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log(`Endpoints disponíveis:`);
    console.log(`- GET /api/status`);
    console.log(`- GET /api/livros`);
    console.log(`- GET /api/livros/buscar?termo=`);
    console.log(`- GET /api/livros/disponibilidade/:id`);
    console.log(`- POST /api/ia (simulação)`);
});