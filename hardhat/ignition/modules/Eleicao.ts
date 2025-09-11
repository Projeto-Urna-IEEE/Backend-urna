import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ElectionModule", (m) => {
  const eleicao = m.contract("Eleicao");

  return { eleicao };
});
