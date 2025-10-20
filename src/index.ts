import express from "express";
import cors from "cors";
import contractArtifact from '../hardhat/artifacts/hardhat/contracts/Eleicao.sol/Eleicao.json' assert { type: "json" };
import { ethers } from "ethers";
import deployment from '../hardhat/ignition/deployments/DeployEleicao/deployed_addresses.json' assert { type: "json" };

const app = express();
app.use(cors());
app.use(express.json());

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545"; 
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("ERRO: Chave privada não encontrada. Defina a variável PRIVATE_KEY no seu arquivo .env");
  process.exit(1); 
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
console.log(`Servidor conectado com a carteira: ${wallet.address}`);

const contractAddress = deployment["EleicaoModule#Eleicao"]; // A chave é "NomeModulo#NomeContrato"
const eleicaoContract = new ethers.Contract(
    contractAddress,      
    contractArtifact.abi, 
    wallet                
);
console.log(`Conectado ao contrato 'Eleicao' no endereço: ${await eleicaoContract.getAddress()}`);

app.get('/estado', async (req, res) => {
  try {
      const estadoAtual = await eleicaoContract.currentElectionState();
      const estados = ["NotStarted", "Registering", "Voting", "Ended"];
      res.json({ estado: estados[Number(estadoAtual)] });
  } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar o estado da eleição.", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("init");
});

