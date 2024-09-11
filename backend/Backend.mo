import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import HashMap "mo:base/HashMap";

import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

import Iter "mo:base/Iter";
import List "mo:base/List";
import Array "mo:base/Array";

actor class Backend() {

  type List<T> = ?(T, List<T>);

  public type Transactions = {
    id : Text;
    from : Text;
    to : Text;
    fromName : Text;
    toName : Text;
    amount : Nat;
    remarks : Text;
  };

  type User = {
    id : Text;
    username : Text;
    password : Text;
    balance : Nat;
    transactions : List<Transactions>;
  };

  stable var allTransactions = List.nil<Transactions>();

  var users = HashMap.HashMap<Text, User>(0, Text.equal, Text.hash);
  stable var usersArray : [(Text, User)] = [];

  public func register(user : User) : async Text {
    let hashedUsername = Nat32.toText(Text.hash(user.username));

    if (users.get(user.username) == null) {
      let newUser : User = {
        id = hashedUsername;
        username = user.username;
        password = Nat32.toText(Text.hash(user.password));
        balance = 100;
        transactions = List.nil();
      };

      users.put(hashedUsername, newUser);

      return hashedUsername;
    };
    return "404";
  };

  public func login(username : Text, password : Text) : async Text {
    switch (users.get(Nat32.toText(Text.hash(username)))) {
      case (null) {
        return "404";
      };
      case (?user) {
        if (user.password == Nat32.toText(Text.hash(password))) {
          return Nat32.toText(Text.hash(user.username));
        } else {
          return "401";
        };
      };
    };
  };

  public func transfer(username : Text, amount : Nat, accountId : Text, transactionId : Text, remarks : Text) : async Text {
    if (username == accountId) {
      return "405";
    };
    switch (users.get(username)) {
      case (null) {
        return "404";
      };
      case (?lender) {
        switch (users.get(accountId)) {
          case (null) {
            return "404";
          };
          case (?borrower) {
            if (lender.balance >= amount) {

              let newTransaction : Transactions = {
                id = Nat32.toText(Text.hash(transactionId));
                from = lender.id;
                to = borrower.id;
                fromName = lender.username;
                toName = borrower.username;
                amount = amount;
                remarks = remarks;
              };

              allTransactions := List.push(newTransaction, allTransactions);

              var lt = lender.transactions;
              lt := List.push(newTransaction, lt);

              let l : User = {
                id = lender.id;
                username = lender.username;
                password = lender.password;
                balance = lender.balance - amount;
                transactions = lt;
              };

              var bt = borrower.transactions;
              bt := List.push(newTransaction, bt);
              let b = {
                id = borrower.id;
                username = borrower.username;
                password = borrower.password;
                balance = borrower.balance + amount;
                transactions = bt;
              };

              users.put(l.id, l);

              users.put(b.id, b);

              return "200";
            } else {
              return "Insufficient balance";
            };
          };
        };
      };
    };
  };

  public query func getUser(token : Text) : async ?User {
    return users.get(token);
  };

  public query func checkClaim(token : Text) : async Text {

    let user = users.get(token);
    switch (user) {
      case (null) {
        return "404";
      };
      case (?user) {
        if (user.balance == 0) {
          let u = {
            id = user.id;
            username = user.username;
            password = user.password;
            balance = 100;
            transactions = List.nil();
          };

          users.put(u.id, u);

          return "200";

        };
        return "201";
      };
    };
  };

  public query func checkBalance(token : Text) : async Nat {
    let user = users.get(token);
    switch (user) {
      case (null) {
        return 404;
      };
      case (?user) {
        return user.balance;
      };
    };
  };

  public query func getUserData(token : Text) : async ?User {
    switch (users.get(token)) {
      case (?user) {
        return ?user;
      };
      case (null) {
        return null; // Return null when user is not found
      };
    };
  };

  public query func getAllTransactions(token : Text) : async ?[Transactions] {
    switch (users.get(token)) {
      case (?user) {
        let transactions = user.transactions;
        return ?List.toArray(transactions);
      };
      case (null) { return null };
    };
  };

  system func preupgrade() {
    usersArray := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Text, User>(usersArray.vals(), 0, Text.equal, Text.hash);
  };

};
