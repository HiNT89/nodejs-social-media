class handle {
  matchUsername(user) {
    const { firstName, middleName, lastName } = user;
    return firstName + " " + middleName + " " + lastName;
  }
}

module.exports = new handle();
