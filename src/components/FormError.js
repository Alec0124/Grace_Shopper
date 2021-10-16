import React from 'react';

const FormError = ({errorMessage}) => {
    if(errorMessage === null) {
        return <> </>
    }
    return <div className="error">
        {errorMessage}
    </div>
};

export default FormError;