package com.beko.DemoBank_v1.repository;

import com.beko.DemoBank_v1.models.TransactionHistory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface TransactHistoryRepository extends CrudRepository<TransactionHistory, Integer> {

    @Query(value = "SELECT * FROM v_transaction_history WHERE user_id = :user_id",nativeQuery = true)
    List<TransactionHistory> getTransactionRecordsById(@Param("user_id")int user_id);

    @Query(value = "SELECT * FROM v_transaction_history WHERE account_id = :account_id",nativeQuery = true)
    List<TransactionHistory> getTransactionRecordsByAccountId(@Param("account_id")int user_id);

}
