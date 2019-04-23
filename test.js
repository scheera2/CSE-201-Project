let req = {
    session: {
        user: {
            id: 1,
            username: "asdf",
            email: "asdf",
            password: "$2b$10$BK5qiLjaSv.LUQUvZBS4aeYWGM4VfaItxygV8V6mWBMRfEiFbdxKS",
            mod: null,
            admin: 1
        }
    },
};

let res = {
    sendCalledWith: '',
    send: function(arg) { 
        this.sendCalledWith = arg;
    }
};

var assert = require('assert');
describe('UserHierarchy', function() {
  describe('Admin', function() {
    it('Should return 1 when user is an admin also 1 for moderator', function(){
      assert.equal(1, req.session.user.admin);
      assert.equal(1, req.session.user.mod);
    });
  });
  describe('Moderator', function() {
    it('Should return 1 for moderator status, null for admin status', function(){
      assert.equal(null, req.session.user.admin);
      assert.equal(1, req.session.user.mod);
    });
  });
});