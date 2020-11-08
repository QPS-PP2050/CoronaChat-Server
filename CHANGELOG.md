# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.3.4 (2020-11-08)


### Features

* add Authorization middleware ([fb25495](https://github.com/QPS-PP2050/CoronaChat-Server/commit/fb25495db410a86dd40de2ab0506620ca4594dc7))
* add direct messages support ([bd98813](https://github.com/QPS-PP2050/CoronaChat-Server/commit/bd98813254fa01c41d38a67ed867b6fb70cca739))
* add mediasoup to dependencies ([b4d8507](https://github.com/QPS-PP2050/CoronaChat-Server/commit/b4d8507db1ac568dcfa44695dc97f3674828fdf1))
* add support for removing users from a server ([10c4379](https://github.com/QPS-PP2050/CoronaChat-Server/commit/10c43799879d37b7c4c3376dc80748db92e545cd))
* Authenticate token and send servers to client ([2f09a54](https://github.com/QPS-PP2050/CoronaChat-Server/commit/2f09a549cc004aec3de4bebcf4346abfc110ecc1))
* avatar on login and memberlist ([2c232fc](https://github.com/QPS-PP2050/CoronaChat-Server/commit/2c232fc3aab025c8fe2ed382dc1ac24b242a900d))
* better token handling and authentication middleware ([7e2cfea](https://github.com/QPS-PP2050/CoronaChat-Server/commit/7e2cfeaef065d5d62d94e502532a818f80dafe30))
* correctly assign session & update memberlist ([e68a8b9](https://github.com/QPS-PP2050/CoronaChat-Server/commit/e68a8b94e8d67cde89d02c6753bc59389b7a24d4))
* finish migrations ([e8279a1](https://github.com/QPS-PP2050/CoronaChat-Server/commit/e8279a16457bf85a708ddec343c5f665514d25bf))
* generate IDs based on twitter snowflake algorithm ([d613eb5](https://github.com/QPS-PP2050/CoronaChat-Server/commit/d613eb5c21c35fc036138bf0cf8862baba5750a7))
* implement https support ([59b6d23](https://github.com/QPS-PP2050/CoronaChat-Server/commit/59b6d23dfa736d89a2267c6b50de01b3d5ef3754))
* implement rudimentary user delete endpoint ([6bbe4b0](https://github.com/QPS-PP2050/CoronaChat-Server/commit/6bbe4b0e129f729be2b567325b07ed99e61b5bab))
* initial implementation of server socket ([aa516f7](https://github.com/QPS-PP2050/CoronaChat-Server/commit/aa516f7a0a349af79008cad94fd80200c734f34e))
* JWT on login ([9ea0fa6](https://github.com/QPS-PP2050/CoronaChat-Server/commit/9ea0fa69b83d8f961f7cc1eb54462d2a5ea2f6a7))
* placeholder to create server ([e69ccfd](https://github.com/QPS-PP2050/CoronaChat-Server/commit/e69ccfd583f7cef975e05116a36eca1d031f9e61))
* properly inplement namespaces ([8a90c59](https://github.com/QPS-PP2050/CoronaChat-Server/commit/8a90c594f4e842b17891ac46f229f35dc1b23cae))
* reissue token with new username ([a6b6293](https://github.com/QPS-PP2050/CoronaChat-Server/commit/a6b62930873d81c4cfd01a6a37cf0329dada7333))
* significant progress in API functionality ([4996a5e](https://github.com/QPS-PP2050/CoronaChat-Server/commit/4996a5ec8c7ad93d0ead4dd7f9672328cbae054b))
* start implementation of namespaces ([1bd7496](https://github.com/QPS-PP2050/CoronaChat-Server/commit/1bd749695cd0ed88afd932b8ff14678c06a59018))
* support inviting users ([8e324d4](https://github.com/QPS-PP2050/CoronaChat-Server/commit/8e324d4b92310f3d16ad50ea2325393ab9d8e30f))
* support username on register ([17132b2](https://github.com/QPS-PP2050/CoronaChat-Server/commit/17132b2fb03ddc1f090ed1d8b9e235537d7b9986))
* user avatars ([0e49598](https://github.com/QPS-PP2050/CoronaChat-Server/commit/0e49598b39f47caa1c56d985054f167ed58551c1))
* wsAuthentication middleware ([d548c53](https://github.com/QPS-PP2050/CoronaChat-Server/commit/d548c5365693e4ff88790173f3a86916a612aa3a))
* **security:** check for Bearer auth token type ([8866e76](https://github.com/QPS-PP2050/CoronaChat-Server/commit/8866e7604c33cd5634abde19ef58f1e7c50c448c))
* ws-demo ([6e2e681](https://github.com/QPS-PP2050/CoronaChat-Server/commit/6e2e681303cebeb30a680944231f986c73b11e06))


### Bug Fixes

* correctly remove change email test ([a572810](https://github.com/QPS-PP2050/CoronaChat-Server/commit/a5728109eba476729bdc8b0f4fd1cd660f8c7aef))
* correctly remove change email test ([0d76053](https://github.com/QPS-PP2050/CoronaChat-Server/commit/0d76053e83030a7c9dac887e670fffd6ba699b70))
* emit direct-message event for sender as well ([5463850](https://github.com/QPS-PP2050/CoronaChat-Server/commit/546385044966c33d8043a87384c974b06b5d15ad))
* ensure no PII is leaked through API ([6879791](https://github.com/QPS-PP2050/CoronaChat-Server/commit/687979174dd1094425467d7a7ca800dd884b6cd7))
* fix an issue with retrieving passwords ([2ecf19e](https://github.com/QPS-PP2050/CoronaChat-Server/commit/2ecf19eeb7cef4da57c3951cd40c207d180f9987))
* fix avatar URL ([33e4e9a](https://github.com/QPS-PP2050/CoronaChat-Server/commit/33e4e9aac97c98fbd0c19750bd87584e1e82be17))
* fix comparison operator ([fb8253b](https://github.com/QPS-PP2050/CoronaChat-Server/commit/fb8253b7590ea4620549c2ac12b546137cc03a10))
* fix dm ([ad5fc40](https://github.com/QPS-PP2050/CoronaChat-Server/commit/ad5fc409af847bf456c2eefa9b61554f9d6d7305))
* fix dms ([e8fae9d](https://github.com/QPS-PP2050/CoronaChat-Server/commit/e8fae9d29120a93a74604e8f6a3cb626f0091692))
* fix dms and other new features ([396dc27](https://github.com/QPS-PP2050/CoronaChat-Server/commit/396dc2780c2c0431011c8d0c8f890a33b6fe7d91))
* fix more typeorm stuff ([0984c21](https://github.com/QPS-PP2050/CoronaChat-Server/commit/0984c21cc61a5a903a2a45d1f44ec9eb512e5e4d))
* fix some typescript issues ([3adee20](https://github.com/QPS-PP2050/CoronaChat-Server/commit/3adee207982cd295722dc9e26b1749cdbfdd179d))
* fix username change ([1be38f2](https://github.com/QPS-PP2050/CoronaChat-Server/commit/1be38f26691cedfe69957d5e8f2317028b72615b))
* fix various errors ([940c7e6](https://github.com/QPS-PP2050/CoronaChat-Server/commit/940c7e6d22f1e28a3a856c5b3fb3cb2457f7bb0b))
* just type coecere ([8fd979b](https://github.com/QPS-PP2050/CoronaChat-Server/commit/8fd979b06eaddcadf879685bc19a76fb440d5d4f))
* prevent password and email from being shown through the API ([2a4eba3](https://github.com/QPS-PP2050/CoronaChat-Server/commit/2a4eba3e4ca341e384f1355c26e5a919c16a0c0c))
* properly emit to channels ([d398e7a](https://github.com/QPS-PP2050/CoronaChat-Server/commit/d398e7a16367661455e1f995196106c4fed393d8))
* remove errorous async ([7cb45b0](https://github.com/QPS-PP2050/CoronaChat-Server/commit/7cb45b0eaf41fdac443df0ad845208f2883b1fd5))
* revert back to using username to route DMs ([00ca59f](https://github.com/QPS-PP2050/CoronaChat-Server/commit/00ca59f81fb39af2c480cc2a682e7b8c97039903))
* update schema ([02a6fd7](https://github.com/QPS-PP2050/CoronaChat-Server/commit/02a6fd7642027bdbf51beeb49665a9fb9e01a481))
* voice ([99cb2a5](https://github.com/QPS-PP2050/CoronaChat-Server/commit/99cb2a5e2820356e5fa008256d867fcef36f965b))
