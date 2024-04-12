/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import '@testing-library/jest-dom';
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      expect(windowIcon).toHaveClass('highlighted');

    })
    test("Then click on button new bill", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      document.body.innerHTML = BillsUI({ data: bills })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const billsContainer = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const btnNewBill = screen.getByTestId('btn-new-bill')
      const handleClickNewBills = jest.fn((e) => billsContainer.handleClickNewBill())
      btnNewBill.addEventListener('click', handleClickNewBills)
      btnNewBill.click()
      

      expect(handleClickNewBills).toHaveBeenCalled()

    })
    test("Ensuite, cliquez sur l'icône de l'œil", async () => {
      // Définir une propriété localStorage mockée sur l'objet window
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // Définir une valeur dans le localStorage
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      // Créer un élément racine div dans le document body
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      // Appeler la fonction router
      router()
      // Simuler le changement de route vers la page des factures
      window.onNavigate(ROUTES_PATH.Bills)
    
      // Injecter le HTML de la page des factures dans le document body
      document.body.innerHTML = BillsUI({ data: bills })
    
      // Définir une fonction onNavigate mockée
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      // Créer un objet store null
      const store = null
      // Créer une instance de la classe Bills
      const billsContainer = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
    
      // Attendre que l'icône de l'œil soit rendue à l'écran
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      window.$ = jest.fn().mockImplementation(() => {
        return {
           modal:jest.fn(),
           width:jest.fn(),
           find: jest.fn().mockImplementationOnce(() =>{return {html: jest.fn() }})
        
         }
     });
      //await waitFor(() => screen.findAllByTestId('icon-eye'))
      // Récupérer toutes les icônes de l'œil
      const eyeIcons = screen.getAllByTestId("icon-eye");
      // Cliquer sur chaque icône de l'œil
    //  eyeIcons.forEach((eyeIcon) => {
    //    eyeIcon.click()
     // });  
    
      const handleClickIconEyes = jest.fn((e) =>billsContainer.handleClickIconEye(e))
       
     // eyeIcons[0].getAttribute=jest.fn((e) =>eyeIcons[0].getAttribute())
    eyeIcons[0].addEventListener("click", handleClickIconEyes)
    eyeIcons[0].click()
      // Vérifier si handleClickIconEyes est appelée après chaque clic sur une icône de l'œil
      expect(handleClickIconEyes).toHaveBeenCalled()
    })
    
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})
