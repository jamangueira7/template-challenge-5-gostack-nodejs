import AppError from '../errors/AppError';
import { getCustomRepository } from "typeorm";
import TransactionsRepository from "../repositories/TransactionsRepository";

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const result = await transactionsRepository.delete({ id });

    if(result.affected == null || result.affected <= 0) {
      throw new AppError('ID not found to delete.', 500);
    }
  }
}

export default DeleteTransactionService;
