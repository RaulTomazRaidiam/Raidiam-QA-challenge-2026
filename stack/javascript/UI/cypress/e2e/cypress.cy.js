describe('Toolshop Broken Favorites Test', () => {
  it('Adds item to favorites', () => {
    cy.visit('https://practicesoftwaretesting.com/');
    cy.wait(1000);

    cy.get('[data-test^="product-"]').first().click();
    cy.get('[data-test="add-to-favorites"]').click();
    cy.get('[data-test="nav-sign-in"]').click();
    cy.get('[data-test="email"]').type('customer3@practicesoftwaretesting.com');
    cy.get('[data-test="password"]').type('pass123');
    cy.get('input[type="submit"]').click();

    cy.wait(3000);
    cy.get("[data-test='nav-menu']").click();
    cy.get('[data-test="nav-my-favorites"]').click();
    cy.get('[data-test^="favorite-"]').should('exist').and('be.visible');
    cy.get('[data-test="product-name"]').should('exist').and('be.visible').and('contain.text', 'Combination Pliers');
    cy.get('[data-test="delete"]').click();
  });
});

// describe('Book Room - Cypress (Bad)', () => {
//   it('books room with poor practices', () => {
//     cy.request('GET', 'https://automationintesting.online/api/room?checkin=2025-05-16&checkout=2025-05-17').then((response) => {
//       // res.should(res.rooms.length > 0)
//       // console.log('response ', response)
//       // console.log('rooms ', response.body)
//       expect(response.body.rooms.length).to.be.gt(0)
//       // cy.wait(2000);
//     });

//     // https://automationintesting.online/api/room?checkin=2025-05-01&checkout=2025-05-31

//     // cy.request('POST', 'https://automationintesting.online/booking', {}
//     //   ).then((bookRes) => {
//     //     console.log(bookRes.body);
//     //   });
//   });
// });