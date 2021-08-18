const LoginRouter = require ('./login-router')
const MissingParamError = require('../helpers/MissingParamError')
const UnauthorizedError = require('../helpers/UnauthorizedError')

const makeSut = () => {
    class AuthUseCaseSpy {
        auth(email,password){
            this.email = email
            this.password = password
            return this.accessToken

        }
    }
    const authUseCaseSpy = new AuthUseCaseSpy()
    authUseCaseSpy.accessToken = 'valid_token'
    const sut = new LoginRouter(authUseCaseSpy)
    return {
        sut,
        authUseCaseSpy 
        

    }
}
describe ( 'Login Router' , () => {
    test ( 'Deve returnar 400 se não tiver email' , () => {
        const { sut } = makeSut()
        const httpRequest = {
            body:{
                password:'any_passaword'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    } )
    
    test ( 'Deve returnar 400 se não tiver senha' , () => {
        const { sut } = makeSut()
        const httpRequest = {
            body:{
                email:'any_email@gmail.com'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    } )
    test ( 'Deve returnar 500 se não tiver httpRequest' , () => {
        const { sut } = makeSut()
        const httpResponse = sut.route()
        expect(httpResponse.statusCode).toBe(500)

    } )
    test ( 'Deve returnar 500 se o httpRequest não tiver body' , () => {
        const { sut } = makeSut()
        const httpResponse = sut.route({})
        expect(httpResponse.statusCode).toBe(500)

    } )
    test ( 'Deve chamar AuthUseCase com os parametros corretos' , () => {
        const {sut , authUseCaseSpy} = makeSut()
        const httpRequest = {
            body:{
                email:'any_email@gmail.com',
                password:'any_password'
            }
        }
        sut.route(httpRequest)
        expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password)


    } )
    test ( 'Deve retornar 401 quando as credenciais forem invalidas' , () => {
        const { sut, authUseCaseSpy } = makeSut()
        authUseCaseSpy.accessToken = null
        const httpRequest = {
            body:{
                email:'invalid_email@gmail.com',
                password:'invalid_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect (httpResponse.statusCode).toBe(401)
        expect(httpResponse.body).toEqual(new UnauthorizedError)

    } )
    test ( 'Deve retornar 200 quando as credenciais forem validas' , () => {
        const { sut, authUseCaseSpy } = makeSut()
        const httpRequest = {
            body:{
                email:'valid_email@gmail.com',
                password:'valid_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect (httpResponse.statusCode).toBe(200)
        expect (httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)

    } )
    test ( 'Deve retornar 500 se nenhum AuthUseCase for fornecido' , () => {
        const sut = new LoginRouter()
        const httpRequest = {
            body:{
                email:'any_email@gmail.com',
                password:'any_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect (httpResponse.statusCode).toBe(500)

    } )
    test ( 'Deve retornar 500 se o AuthUseCase fornecido não tiver auth method' , () => {
        class AuthUseCaseSpy{}
        const authUseCaseSpy = new AuthUseCaseSpy()
        const sut = new LoginRouter(authUseCaseSpy)
        const httpRequest = {
            body:{
                email:'any_email@gmail.com',
                password:'any_password'
            }
        }
        const httpResponse = sut.route(httpRequest)
        expect (httpResponse.statusCode).toBe(500)

    } )
} )