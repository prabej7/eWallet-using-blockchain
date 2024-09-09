import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";

actor class Backend() {

  type User = {
    id : Text;
    username : Text;
    password : Text;
    balance : Nat;
  };

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

  public func transfer(username : Text, amount : Nat, accountId : Text) : async Text {
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

              let l = {
                id = lender.id;
                username = lender.username;
                password = lender.password;
                balance = lender.balance - amount;
              };

              let b = {
                id = borrower.id;
                username = borrower.username;
                password = borrower.password;
                balance = borrower.balance + amount;
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

  system func preupgrade() {
    usersArray := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Text, User>(usersArray.vals(), 0, Text.equal, Text.hash);
  };

};
