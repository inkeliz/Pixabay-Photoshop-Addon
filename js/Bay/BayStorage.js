/**
 * Created by lucas on 30/09/2017.
 */

BayStorage = {

    Configuration: {

        Search: {

            struct: PixaAPI.Search.Image.Param.Default,

            read: function () {
                var struct = this.struct;
                var configuration = localStorage.getItem('configurationSearch');

                if (configuration !== null) {
                    struct =  JSON.parse(configuration);
                }

                return struct;
            },

            write: function (struct) {
                var configuration = struct;

                if (configuration !== null) {
                    localStorage.setItem('configurationSearch', JSON.stringify(configuration));
                }

                return this.read();
            }

        },

        Download: {

            struct: {size: '_1920', mode: 'file'},

            read: function () {
                var struct = this.struct;
                var configuration = localStorage.getItem('configurationDownload');

                if (configuration !== null) {
                    struct = JSON.parse(configuration);
                }

                return struct;
            },

            write: function (struct) {
                var configuration = struct;

                if (configuration !== null) {
                    localStorage.setItem('configurationDownload', JSON.stringify(configuration));
                }

                return this.read();
            },

            reset: function () {
                return this.write(this.struct);
            }

        }

    },


    History: {

        Download: {

            struct: {},

            read: function () {
                var struct = this.struct;
                var configuration = localStorage.getItem('historyDownload');

                if (configuration !== null) {
                    struct = JSON.parse(configuration);
                }

                return struct;
            },

            write: function (struct) {
                var configuration = struct;

                if (configuration !== null) {
                    localStorage.setItem('historyDownload', JSON.stringify(configuration));
                }

                return this.read();
            },

            reset: function () {
                return this.write(this.struct);
            }

        }

    }


};