import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(transactionsArg: Transaction[]): Promise<Balance> {
    const { income, outcome } = transactionsArg.reduce((accumulator: Balance, transaction: Transaction) => {
      switch ( transaction.type) {
        case 'income':
          accumulator.income += transaction.value;
          break;
        case 'outcome':
          accumulator.outcome += transaction.value;
          break;
      }
      return accumulator;
    },
    {
      income: 0,
      outcome: 0,
      total: 0,
    });

      const total = income - outcome;

      return { income, outcome, total };
  }
}

export default TransactionsRepository;
