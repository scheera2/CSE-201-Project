let req = {
    session: {
        user: {
            id: 1,
            username: "test",
            email: "test",
            password: "$2b$10$BK5qiLjaSv.LUQUvZBS4aeYWGM4VfaItxygV8V6mWBMRfEiFbdxKS",
            mod: null,
            admin: null
        },
        adminUser: {
          id: 2,
          username: "asdf",
          email: "asdf",
          password: "$2b$10$BK5qiLjaSv.LUQUvZBS4aeYWGM4VfaItxygV8V6mWBMRfEiFbdxKS",
          mod: null,
          admin: 1
      },
      modUser: {
        id: 3,
        username: "asdf",
        email: "asdf",
        password: "$2b$10$BK5qiLjaSv.LUQUvZBS4aeYWGM4VfaItxygV8V6mWBMRfEiFbdxKS",
        mod: 1,
        admin: null
      }
    },
};

var assert = require('assert');
var db = require('./db.js');

describe('UserHierarchy', function() {
  describe('Admin', function() {
    it('Should return 1 when user is an admin, null for mod status', function(){
      assert.equal(1, req.session.adminUser.admin);
      assert.equal(null, req.session.adminUser.mod);
    });
  });
  describe('Moderator', function() {
    it('Should return 1 for moderator status, null for admin status', function(){
      assert.equal(null, req.session.modUser.admin);
      assert.equal(1, req.session.modUser.mod);
    });
  });
  describe('User', function() {
    it('Should return null for moderator status, null for admin status', function(){
      assert.equal(null, req.session.user.admin);
      assert.equal(null, req.session.user.mod);
    });
  });
});


describe('Account Information', function() {

  describe('User', function() {
    it('Password should be hashed', function(){
      assert.equal("$2b$10$BK5qiLjaSv.LUQUvZBS4aeYWGM4VfaItxygV8V6mWBMRfEiFbdxKS", req.session.user.password);
      });
  });
  describe('Database', function() {
    it('Query DB', function(){
      
      const selectQuery = 'SELECT * FROM appUsers WHERE username = $1';
      const selectResult = db.query(selectQuery, "test");
      console.log(selectResult.rows);
      });
  });

});