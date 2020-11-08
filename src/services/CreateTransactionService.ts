import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository";

import Category from "../models/Category";
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const findCategoryExists = await categoryRepository.findOne({
      where: { category },
    });

    let catId = '0';

    const AllTransactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance(AllTransactions);

    if(type === 'outcome' && balance.total < value ){
      throw new AppError('You do not have enough balance');
    }

    if(findCategoryExists) {
      catId = findCategoryExists.id;
    } else {
      const catetoryResponse = categoryRepository.create({ title: category });
      await categoryRepository.save(catetoryResponse);
      catId = catetoryResponse.id;
    }

    const transaction = transactionsRepository.create({ title, value, type, category_id: catId });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
