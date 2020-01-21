export default class User {
  constructor(id, email, password, firstName, lastName, roles, resetPasswordToken, resetPasswordExpires, updated, created) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roles = roles;
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpires = resetPasswordExpires;
    this.updated = updated;
    this.created = created;
  }
}