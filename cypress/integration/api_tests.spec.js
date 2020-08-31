const data = Cypress.env("product_data");
let product_id = "";
describe('The Home Page', () => {
    it('successfully loads', () => {
      cy.visit('/') 
    })
})

describe('Creating Product Using API', () =>{
    it('create product', () =>{
        cy.request({
            auth: {
                username: Cypress.env("user"),
                password: Cypress.env("password")
            },
            method: 'POST',
            url: '/wp-json/wc/v3/products',
            body: data
          }).then((response) => {
            expect(response.status).to.eq(201)
            product_id = response.body.id;
          })
    })
})

describe('Finding Product', ()=> {
    it('find created product', () => {
        cy.visit(`/product/${data.name}`)
        cy.get('.product_title.entry-title').should('be.visible');
        cy.get('.product_title.entry-title').should('contain', data.name);
        cy.get('.woocommerce-Price-amount.amount').should('contain', data.regular_price);
    })
})

describe('Adding Product to Cart', ()=> {
    it('add items to cart', () => {
        cy.get('.input-text.qty.text').clear();
        cy.get('.input-text.qty.text').type('7');
        cy.get('.single_add_to_cart_button.button.alt').click();
        cy.get('a.cart-contents span.count').should('contain', "7");
        cy.visit("/cart/");
    })
})
  
describe('Validating Product In Cart', ()=> {
      it('validate products on shopping card', () => {
        cy.get('.woocommerce-cart-form__cart-item.cart_item').should('be.visible');
        cy.get('.product-name').should('contain', data.name);
        cy.get('.woocommerce-Price-amount.amount').should('contain', data.regular_price);
        cy.get('.input-text.qty.text').should('have.value', "7");
    })
})

describe('Removing Product Using API', ()=> {
    it('remove product', () => {
        cy.request({
            auth: {
                username: Cypress.env("user"),
                password: Cypress.env("password")
            },
            method: 'DELETE',
            url: `/wp-json/wc/v3/products/${product_id}` 
          }).then((response) => {
            expect(response.status).to.eq(200)
          })
  })
})




    
