class TokenizeConfigs{

    constructor(){
        
        if (TokenizeConfigs.instance){
            return  TokenizeConfigs.instance
        }
        this.encryptedDataUrl=null;
        this.accessTokenUrl=null;
        this.accessTokenPayload=null;
        this.accessTokenAuth =null;
        this.serverPublicKey =null;
        this.internalPrivateKey =null;

        TokenizeConfigs.instance=this;
    }

    initializeVariable(data){

        this.serverPublicKey = data?.serverPublicKey;
        this.internalPrivateKey = data?.internalPrivateKey;
        this.accessTokenUrl = data?.accessTokenUrl;
        this.accessTokenPayload = data?.accessTokenPayload;
        this.accessTokenAuth = data?.accessTokenAuth;
        this.encryptedDataUrl = data?.encryptedDataUrl;

    }
}


module.exports = new TokenizeConfigs();
