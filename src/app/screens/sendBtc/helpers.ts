import { btcTransaction } from '@secretkeylabs/xverse-core';

type TransactionBuildPayload = {
  transaction: btcTransaction.EnhancedTransaction;
  summary: btcTransaction.TransactionSummary;
  dustFiltered?: boolean;
};

export const generateTransaction = async (
  transactionContext: btcTransaction.TransactionContext,
  toAddress: string,
  amount: bigint,
  feeRate: number,
): Promise<TransactionBuildPayload> => {
  const transaction = await btcTransaction.sendBtc(
    transactionContext,
    [
      {
        toAddress,
        amount,
      },
    ],
    feeRate,
  );

  const summary = await transaction.getSummary();

  return { transaction, summary };
};

export const generateSendMaxTransaction = async (
  transactionContext: btcTransaction.TransactionContext,
  toAddress: string,
  feeRate: number,
): Promise<TransactionBuildPayload> => {
  const { transaction, dustFiltered } = await btcTransaction.sendMaxBtc(
    transactionContext,
    toAddress,
    feeRate,
  );

  const summary = await transaction.getSummary();

  return { transaction, summary, dustFiltered };
};