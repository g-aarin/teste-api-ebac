/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import contrato from "../contracts/usuarios.contract"

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {

    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
  }).then((response) => {
    expect(response.status);to.equal(200)
  })
  });

  it('Deve listar usuários cadastrados', () => {

    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {

    cy.request({
      method: 'POST',
      url:'usuarios',
      body:{
        "nome": "rakan",
        "email": "rakan@teste.com",
        "password": "teste",
        "administrador": "false"
      }
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal("Cadastro realizado com sucesso")
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'login',
      body: {
        "email": "fulan2o@qa.com",
        "password": "teste" 
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(401)
      expect(response.body.message).to.equal("Email e/ou senha inválidos")
    })
  });

  it.only('Deve editar um usuário previamente cadastrado', () => {
    let usuario = `usuarioNovo ${Math.floor(Math.random() * 100000000)}`
    cy.cadastrarUsuarios("randomuser", "randomemail564@qa.com", "randompassword", "false")
    .then(response => {
      let id = response.body[0].id

      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {

            "nome": usuario,
            "email": "randomemail764@qa.com",
            "password": "randompassword",
            "administrador": "true"
        }
      }).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let email = `emailAleatorio ${faker.internet.email()}`
    cy.cadastrarUsuarios("Steven", email, "wasd2244", "false")
    .then(response => {
      let id = response.body._id    
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`
      }).then(response => {
        expect(response.body.message).to.equal('Registro excluído com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  })